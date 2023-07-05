// Copyright 2022 Curtin University
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: James Diprose

//@ts-ignore
import fs from "fs";
//@ts-ignore
import path from "path";
import { Dict, Entity, Query, QueryResult } from "@/types";

const SCHEMA = `
DROP TABLE IF EXISTS entity;
DROP TABLE IF EXISTS entity_fts5;

CREATE TABLE entity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- country, institution
    name TEXT NOT NULL,
    acronyms TEXT,
    logo_sm TEXT NOT NULL,
    subregion TEXT NOT NULL,
    region TEXT NOT NULL, 
    country_code INTEGER, -- null for country
    country_name TEXT, -- null for country       
    institution_type TEXT, -- null for country
    n_outputs INT NOT NULL,
    n_outputs_open INT NOT NULL,
    p_outputs_open FLOAT NOT NULL,
    p_outputs_publisher_open_only FLOAT NOT NULL,
    p_outputs_both FLOAT NOT NULL,
    p_outputs_other_platform_open_only FLOAT NOT NULL,
    p_outputs_closed FLOAT NOT NULL
);

-- Filter by entity_type
CREATE INDEX idx_entity_entity_type ON entity(entity_type);

-- Indexes for sorting
CREATE INDEX idx_entity_name ON entity(name);
CREATE INDEX idx_entity_n_outputs ON entity(n_outputs);
CREATE INDEX idx_entity_n_outputs_open ON entity(n_outputs_open);
CREATE INDEX idx_entity_p_outputs_open ON entity(p_outputs_open);

-- Virtual table for text search
CREATE VIRTUAL TABLE entity_fts5 USING fts5(name, acronyms, subregion, region, country_name, content='entity', content_rowid='id', tokenize='trigram');

`;

/*
-- Country indexes for filtering
CREATE INDEX idx_country_filter ON country(n_outputs, n_outputs_open, p_outputs_open, subregion);
CREATE INDEX idx_country_entity_id ON country(entity_id);

-- Institution index for filtering
CREATE INDEX idx_institution_filter_subregion ON institution(n_outputs, n_outputs_open, p_outputs_open, subregion, institution_type);
CREATE INDEX idx_institution_filter_institution_type ON institution(n_outputs, n_outputs_open, p_outputs_open, institution_type, subregion);
CREATE INDEX idx_institution_entity_id ON institution(entity_id);

-- Institution index for sorting
CREATE INDEX idx_institution_name ON institution(name);
CREATE INDEX idx_institution_n_outputs ON institution(n_outputs);
CREATE INDEX idx_institution_n_outputs_open ON institution(n_outputs_open);
CREATE INDEX idx_institution_p_outputs_open ON institution(p_outputs_open);
 */

function loadEntityIndex(filePath: string): Array<Entity> {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function joinWithCommas(arr: (string | number | null | undefined)[]): string {
  return arr
    .map(item => {
      // null or undefined
      if (item == null) {
        return "NULL";
      } else if (typeof item === "string") {
        return `'${item}'`;
      } else {
        return item.toString();
      }
    })
    .join(",");
}

export function saveSQLToFile(dataPath: string, outputPath: string) {
  // Generate the SQL for the database
  let entities = [
    ...loadEntityIndex(path.join(dataPath, "country.json")),
    ...loadEntityIndex(path.join(dataPath, "institution.json")),
  ];

  // Add schema
  const rows = [SCHEMA];

  // Generate country SQL
  entities.forEach(entity => {
    const entity_id = entity.id;
    const name = entity.name.replaceAll("'", "''");
    const acronyms = entity.acronyms?.map(v => v.replaceAll("'", "''"))?.join(" ");
    const country_code = entity.country_code;
    const country_name = entity.country_name;
    const institution_type = entity.institution_type;

    const values = [
      null,
      entity_id,
      entity.entity_type,
      name,
      acronyms,
      entity.logo_sm,
      entity.subregion,
      entity.region,
      country_code,
      country_name,
      institution_type,
      entity.stats.n_outputs,
      entity.stats.n_outputs_open,
      entity.stats.p_outputs_open,
      entity.stats.p_outputs_publisher_open_only,
      entity.stats.p_outputs_both,
      entity.stats.p_outputs_other_platform_open_only,
      entity.stats.p_outputs_closed,
    ];
    rows.push(`INSERT INTO entity VALUES(${joinWithCommas(values)});`);
  });

  // Insert data into fts5 table
  rows.push(
    `INSERT INTO entity_fts5 (rowid, name, acronyms, subregion, region, country_name) SELECT id, name, acronyms, subregion, region, country_name FROM entity;`,
  );

  // Save to file
  const sql = rows.join("\n");
  fs.writeFileSync(outputPath, sql);
}

const PROPERTIES_TO_DELETE = [
  "entity_id",
  "n_outputs",
  "n_outputs_open",
  "p_outputs_open",
  "p_outputs_publisher_open_only",
  "p_outputs_both",
  "p_outputs_other_platform_open_only",
  "p_outputs_closed",
  "total_rows",
];

export function rowsToEntities(rows: Array<Dict>): Array<Entity> {
  const entities: Array<Entity> = [];
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];

    // Set id
    row["id"] = row["entity_id"];

    // Nest the stats object
    row["stats"] = {
      n_outputs: row["n_outputs"],
      n_outputs_open: row["n_outputs_open"],
      p_outputs_open: row["p_outputs_open"],
      p_outputs_publisher_open_only: row["p_outputs_publisher_open_only"],
      p_outputs_both: row["p_outputs_both"],
      p_outputs_other_platform_open_only: row["p_outputs_other_platform_open_only"],
      p_outputs_closed: row["p_outputs_closed"],
    };

    // Delete unused properties
    const properties = PROPERTIES_TO_DELETE;
    if (row.entity_type === "country") {
      properties.push(...["country_code", "country_name", "institution_type"]);
    }
    for (let j = 0; j < properties.length; j++) {
      const property = properties[j];
      if (row[property] !== undefined) {
        delete row[property];
      }
    }

    entities.push(row as Entity);
  }

  return entities;
}

function makeTemplateParams(n: number) {
  return Array(n)
    .fill("?")
    .join(",");
}

export async function searchEntities(db: D1Database, text: string, limit: number) {
  console.log("searchEntities");
  const { results } = await db
    .prepare(
      "SELECT entity.*, entity_fts5.rank FROM entity JOIN entity_fts5 ON entity.id = entity_fts5.rowid WHERE entity_fts5 MATCH ? ORDER BY entity_fts5.rank LIMIT ?;",
      // "SELECT* FROM entity_fts5 WHERE entity_fts5 MATCH ?",
    )
    .bind(text, limit)
    .all();
  // console.log(results);
  return rowsToEntities(results as Array<Dict>);
}

const VALID_ENTITY_TYPES = new Set(["country", "institution"]);
const VALID_ORDER_BY = new Set(["name", "n_outputs", "n_outputs_open", "p_outputs_open"]);

export async function filterEntities(entityType: string, db: D1Database, query: Query): Promise<QueryResult> {
  // Validate parameters that are string substituted without using .bind
  if (!VALID_ENTITY_TYPES.has(entityType)) {
    const msg = `filterEntities: invalid entityType ${entityType}, should be one of ${VALID_ENTITY_TYPES}`;
    console.error(msg);
    throw msg;
  }
  if (!VALID_ORDER_BY.has(query.orderBy)) {
    const msg = `filterEntities: invalid orderBy ${query.orderBy}`;
    console.error(msg);
    throw msg;
  }

  // Build query
  const sql = [];
  const params: Array<any> = [];

  sql.push(`SELECT entity.*, subset.total_rows`);
  sql.push(`FROM entity`);

  sql.push(`INNER JOIN (SELECT entity.id, COUNT(*) OVER() AS total_rows`);
  sql.push(`FROM entity`);
  sql.push(`WHERE entity_type = ?`);
  params.push(entityType);

  if (query.ids.size) {
    // Fetch specific entities
    sql.push(`AND entity.entity_id IN (${makeTemplateParams(query.ids.size)})`);
    params.push(...Array.from(query.ids));
  } else {
    // Include if n_outputs is between filter values
    sql.push(`AND entity.n_outputs BETWEEN ? AND ?`);
    params.push(query.minNOutputs);
    params.push(query.maxNOutputs);

    // Include if n_outputs_open is between filter values
    sql.push(`AND entity.n_outputs_open BETWEEN ? AND ?`);
    params.push(query.minNOutputsOpen);
    params.push(query.maxNOutputsOpen);

    // Include if p_outputs_open is between filter values
    sql.push(`AND entity.p_outputs_open BETWEEN ? AND ?`);
    params.push(query.minPOutputsOpen);
    params.push(query.maxPOutputsOpen);

    // Include if regions parameter specified and matches
    if (query.regions.size) {
      sql.push(`AND entity.region IN (${makeTemplateParams(query.regions.size)})`);
      params.push(...Array.from(query.regions));
    }

    // Include if subregions parameter specified and matches
    if (query.subregions.size) {
      sql.push(`AND entity.subregion IN (${makeTemplateParams(query.subregions.size)})`);
      params.push(...Array.from(query.subregions));
    }

    // Institution specific filtering
    if (entityType === "institution") {
      // Search for institutions with a specific institution type
      if (query.institutionTypes.size) {
        sql.push(`AND entity.institution_type IN (${makeTemplateParams(query.institutionTypes.size)})`);
        params.push(...Array.from(query.institutionTypes));
      }

      // Search for institutions in particular countries
      if (query.countries.size) {
        sql.push(`AND entity.country_code IN (${makeTemplateParams(query.countries.size)})`);
        params.push(...Array.from(query.countries));
      }
    }
  }

  // Order by
  let orderBy;
  if (query.orderDir === "asc") {
    orderBy = `ORDER BY entity.${query.orderBy} ASC`;
  } else {
    orderBy = `ORDER BY entity.${query.orderBy} DESC`;
  }
  sql.push(orderBy);

  // Limit and offset
  const limit = query.limit;
  const offset = query.page * query.limit;
  sql.push("LIMIT ? OFFSET ?");
  params.push(limit);
  params.push(offset);

  // Outer query
  sql.push(`) AS subset ON subset.id = entity.id`);
  sql.push(orderBy);

  // Build query
  const queryString = sql.join("\n");
  console.log(queryString);

  // // Run query plan
  // const stmt_query_plan = db.prepare("EXPLAIN QUERY PLAN " + queryString).bind(...params);
  // const results_query_plan = await stmt_query_plan.all();
  // console.log(`QUERY PLAN: ${JSON.stringify(results_query_plan)}`);

  // Run query
  const stmt = db.prepare(queryString).bind(...params);
  const { results } = await stmt.all();

  // Get total rows
  let nItems = 0;
  if (results?.length) {
    // @ts-ignore
    nItems = results[0]["total_rows"];
  }

  // Parse results
  const entities: Array<Entity> = rowsToEntities(results as Array<Dict>);

  // Make final search object
  return {
    items: entities,
    nItems: nItems,
    page: query.page,
    limit: query.limit,
    orderBy: query.orderBy,
    orderDir: query.orderDir,
  };
}
