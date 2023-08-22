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

const VALID_ENTITY_TYPES = new Set(["country", "institution"]);
const VALID_ORDER_BY = new Set([
  "name",
  "n_outputs",
  "n_outputs_open",
  "p_outputs_open",
  "n_outputs_black",
  "p_outputs_black",
]);
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
  "n_outputs_black",
  "p_outputs_black",
  "acronyms",
  "search_weight",
  "search_country_region_weight",
  "search_inst_country_weight",
];

// entity
// entity_type TEXT NOT NULL, -- country, institution
// country_code INTEGER, -- null for country
// country_name TEXT, -- null for country
// institution_type TEXT, -- null for country
// -- Filter by entity_type
// idx_entity_entity_type
// -- Indexes for sorting
// idx_entity_name
// idx_entity_n_outputs
// idx_entity_n_outputs_open
// idx_entity_p_outputs_open
// --- Indexes for filtering
// idx_entity_filter
// -- Virtual table for text search
// entity_fts5

// The Miniflare V2 db.exec doesn't parse SQL very well, hence the lack of newlines and comments
const SCHEMA = `DROP TABLE IF EXISTS entity;
DROP TABLE IF EXISTS entity_fts5;
CREATE TABLE entity (id INTEGER PRIMARY KEY AUTOINCREMENT, entity_id TEXT NOT NULL, entity_type TEXT NOT NULL, name TEXT NOT NULL, acronyms TEXT, logo_sm TEXT NOT NULL, subregion TEXT NOT NULL, region TEXT NOT NULL, country_code INTEGER, country_name TEXT, institution_type TEXT, n_outputs INT NOT NULL, n_outputs_open INT NOT NULL, n_outputs_black INT NOT NULL, p_outputs_open FLOAT NOT NULL, p_outputs_publisher_open_only FLOAT NOT NULL, p_outputs_both FLOAT NOT NULL, p_outputs_other_platform_open_only FLOAT NOT NULL, p_outputs_closed FLOAT NOT NULL, p_outputs_black FLOAT NOT NULL, search_weight FLOAT NOT NULL, search_country_region_weight FLOAT NOT NULL, search_inst_country_weight FLOAT NOT NULL);
CREATE INDEX idx_entity_entity_type ON entity(entity_type);
CREATE INDEX idx_entity_name ON entity(name);
CREATE INDEX idx_entity_n_outputs ON entity(n_outputs);
CREATE INDEX idx_entity_n_outputs_open ON entity(n_outputs_open);
CREATE INDEX idx_entity_p_outputs_open ON entity(p_outputs_open);
CREATE INDEX idx_entity_filter ON entity(entity_type, n_outputs, n_outputs_open, p_outputs_open, subregion, institution_type);
CREATE VIRTUAL TABLE entity_fts5 USING fts5(name, acronyms, region, country_name, content='none', tokenize='porter unicode61 remove_diacritics 1');`;

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

export function loadEntities(dataPath: string): Array<Entity> {
  return [
    ...loadEntityIndex(path.join(dataPath, "country.json")),
    ...loadEntityIndex(path.join(dataPath, "institution.json")),
  ];
}

function loadEntityIndex(filePath: string): Array<Entity> {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveSQLToFile(sql: string, outputPath: string) {
  fs.writeFileSync(outputPath, sql);
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

export function entitiesToSQL(entities: Array<Entity>) {
  // Add schema
  const rows = [SCHEMA];

  // Find max outputs for institutions in each country
  const instCountryMaxOutputs: { [key: string]: number } = {};
  for (const entity of entities) {
    const countryCode = entity.country_code;
    if (countryCode && entity.entity_type === "institution") {
      if (!(countryCode in instCountryMaxOutputs)) {
        instCountryMaxOutputs[countryCode] = entity.stats.n_outputs;
      } else if (entity.stats.n_outputs > instCountryMaxOutputs[countryCode]) {
        instCountryMaxOutputs[countryCode] = entity.stats.n_outputs;
      }
    }
  }

  // Find max outputs for countries in regions
  const countryRegionMaxOutputs: { [key: string]: number } = {};
  for (const entity of entities) {
    const region = entity.region;
    if (entity.entity_type === "country") {
      if (!(region in countryRegionMaxOutputs)) {
        countryRegionMaxOutputs[region] = entity.stats.n_outputs;
      } else if (entity.stats.n_outputs > countryRegionMaxOutputs[region]) {
        countryRegionMaxOutputs[region] = entity.stats.n_outputs;
      }
    }
  }

  // Generate country SQL
  entities.forEach(entity => {
    const entity_id = entity.id;
    const name = entity.name.replaceAll("'", "''");
    const acronyms = entity.acronyms?.map(v => v.replaceAll("'", "''"))?.join(" ");
    const country_code = entity.country_code;
    const country_name = entity.country_name;
    const institution_type = entity.institution_type;

    // Calculate search weights
    // For the fts5 ranking, more negative is better
    let search_weight = 1.0;
    let search_country_region_weight = 1.0;
    let search_inst_country_weight = 1.0;
    entity.stats.n_outputs;
    if (entity.entity_type === "country") {
      // Make countries appear higher in results than institutions
      // E.g. when you type "New Zealand", the New Zealand entity should appear first and then institutions from New Zealand
      search_weight = 2.0;

      // When searching by region, make countries with more publications appear first
      search_country_region_weight = 1 + entity.stats.n_outputs / countryRegionMaxOutputs[entity.region];
    } else if (entity.entity_type === "institution") {
      // When searching by country, make institutions with more publications appear first
      search_inst_country_weight = 1 + entity.stats.n_outputs / instCountryMaxOutputs[entity.country_code as string];
    }

    // Careful with the ordering of these!
    let values = [
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
      entity.stats.n_outputs_black,
      entity.stats.p_outputs_open,
      entity.stats.p_outputs_publisher_open_only,
      entity.stats.p_outputs_both,
      entity.stats.p_outputs_other_platform_open_only,
      entity.stats.p_outputs_closed,
      entity.stats.p_outputs_black,
      search_weight,
      search_country_region_weight,
      search_inst_country_weight,
    ];
    rows.push(`INSERT INTO entity VALUES(${joinWithCommas(values)});`);

    // Insert into entity_fts5
    // Remove country name for countries that already have that exact name in their title
    let fts_country_name: string | null | undefined = country_name;
    if (country_name != null && name.toLowerCase().includes(country_name.toLowerCase())) {
      fts_country_name = null;
    }
    // Don't include subregion as sometimes these have country names which make the search unintuitive,
    values = [name, acronyms, entity.region, fts_country_name];
    rows.push(
      `INSERT INTO entity_fts5(rowid, name, acronyms, region, country_name) VALUES(last_insert_rowid(), ${joinWithCommas(
        values,
      )});`,
    );
  });

  // Save to file
  return rows.join("\n");
}

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
      n_outputs_black: row["n_outputs_black"],
      p_outputs_open: row["p_outputs_open"],
      p_outputs_publisher_open_only: row["p_outputs_publisher_open_only"],
      p_outputs_both: row["p_outputs_both"],
      p_outputs_other_platform_open_only: row["p_outputs_other_platform_open_only"],
      p_outputs_closed: row["p_outputs_closed"],
      p_outputs_black: row["p_outputs_black"],
    };

    // Delete unused properties
    const properties = [...PROPERTIES_TO_DELETE]; // Copy array otherwise we end up modifying it
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

const SEARCH_QUERY = `SELECT entity.*, weighted_rank, subset.total_rows
FROM entity
INNER JOIN (SELECT entity.id, entity_fts5.rank * entity.search_weight * entity.search_country_region_weight * entity.search_inst_country_weight as weighted_rank, COUNT(*) OVER() AS total_rows
FROM entity 
JOIN entity_fts5 ON entity.id = entity_fts5.rowid
WHERE entity_fts5 MATCH ?
ORDER BY weighted_rank
LIMIT ? OFFSET ?
) AS subset ON subset.id = entity.id`;

function ftsEscape(text: string) {
  return text.replace(/"/g, '""');
}

export async function searchEntities(
  db: D1Database,
  text: string,
  acronym: boolean,
  page: number,
  limit: number,
): Promise<QueryResult> {
  let nItems = 0;
  let entities: Array<Entity> = [];

  // If empty string then return empty results
  if (text.trim() !== "") {
    let value = `"${ftsEscape(text)}"*`;
    if (acronym) {
      value = `acronyms:"${ftsEscape(text)}"*`;
    }

    // Calculate offset
    const offset = page * limit;
    const { results } = await db
      .prepare(SEARCH_QUERY)
      .bind(value, limit, offset)
      .all();

    // Parse results
    if (results?.length) {
      // @ts-ignore
      nItems = results[0]["total_rows"];
      entities = rowsToEntities(results as Array<Dict>);
    }
  }

  // Make final search object
  return {
    items: entities,
    nItems: nItems,
    page: page,
    nPages: Math.ceil(nItems / limit),
    limit: limit,
    orderBy: undefined,
    orderDir: undefined,
  };
}

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
  // console.log(queryString);

  // Run query plan
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
    nPages: Math.ceil(nItems / limit),
    limit: query.limit,
    orderBy: query.orderBy,
    orderDir: query.orderDir,
  };
}
