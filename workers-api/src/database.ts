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
DROP TABLE IF EXISTS institution;
DROP TABLE IF EXISTS country;

CREATE TABLE country (
    id INTEGER NOT NULL,
    entity_id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    logo_sm varchar(255) NOT NULL,
    subregion varchar(255) NOT NULL,
    region varchar(255) NOT NULL,
    n_outputs INT NOT NULL,
    n_outputs_open INT NOT NULL,
    p_outputs_open FLOAT NOT NULL,
    p_outputs_publisher_open_only FLOAT NOT NULL,
    p_outputs_both FLOAT NOT NULL,
    p_outputs_other_platform_open_only FLOAT NOT NULL,
    p_outputs_closed FLOAT NOT NULL,
    
    PRIMARY KEY (id)
);

-- Country indexes for filtering
CREATE INDEX idx_country_filter ON country(n_outputs, n_outputs_open, p_outputs_open, subregion);
CREATE INDEX idx_country_entity_id ON country(entity_id);

-- Country indexes for sorting
CREATE INDEX idx_country_name ON country(name);
CREATE INDEX idx_country_n_outputs ON country(n_outputs);
CREATE INDEX idx_country_n_outputs_open ON country(n_outputs_open);
CREATE INDEX idx_country_p_outputs_open ON country(p_outputs_open);

CREATE TABLE institution (
    id INTEGER NOT NULL,
    entity_id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    logo_sm varchar(255) NOT NULL,
    subregion varchar(255) NOT NULL,
    region varchar(255) NOT NULL,
    country_id INTEGER NOT NULL,
    institution_type varchar(255),
    n_outputs INT NOT NULL,
    n_outputs_open INT NOT NULL,
    p_outputs_open FLOAT NOT NULL,
    p_outputs_publisher_open_only FLOAT NOT NULL,
    p_outputs_both FLOAT NOT NULL,
    p_outputs_other_platform_open_only FLOAT NOT NULL,
    p_outputs_closed FLOAT NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (country_id) REFERENCES country(id)
);

-- Institution index for filtering
CREATE INDEX idx_institution_filter_subregion ON institution(n_outputs, n_outputs_open, p_outputs_open, subregion, institution_type);
CREATE INDEX idx_institution_filter_institution_type ON institution(n_outputs, n_outputs_open, p_outputs_open, institution_type, subregion);
CREATE INDEX idx_institution_entity_id ON institution(entity_id);

-- Institution index for sorting
CREATE INDEX idx_institution_name ON institution(name);
CREATE INDEX idx_institution_n_outputs ON institution(n_outputs);
CREATE INDEX idx_institution_n_outputs_open ON institution(n_outputs_open);
CREATE INDEX idx_institution_p_outputs_open ON institution(p_outputs_open);
`;

function loadEntityIndex(filePath: string): Array<Entity> {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function saveSQLToFile(dataPath: string, outputPath: string) {
  // Generate the SQL for the database
  const countries: Array<Entity> = loadEntityIndex(path.join(dataPath, "country.json"));
  const institutions: Array<Entity> = loadEntityIndex(path.join(dataPath, "institution.json"));

  // Add schema
  const rows = [SCHEMA];

  // Generate country SQL
  const countryMap = new Map<string, number>();
  countries.forEach((entity, id) => {
    const name = entity.name.replaceAll("'", "''");
    rows.push(
      `INSERT INTO country VALUES(${id},'${entity.id}','${name}','${entity.logo_sm}','${entity.subregion}','${entity.region}',${entity.stats.n_outputs},${entity.stats.n_outputs_open},${entity.stats.p_outputs_open},${entity.stats.p_outputs_publisher_open_only},${entity.stats.p_outputs_both},${entity.stats.p_outputs_other_platform_open_only},${entity.stats.p_outputs_closed});`,
    );
    countryMap.set(entity.id, id);
  });

  // Generate institution SQL
  rows.push("");
  institutions.forEach((entity, i) => {
    const id = countries.length + i;
    const name = entity.name.replaceAll("'", "''");
    if (entity.country_code === undefined) {
      throw `Institution ${entity.id}, ${entity.name} does not have a country_code`;
    }
    const countryId = countryMap.get(entity.country_code);
    rows.push(
      `INSERT INTO institution VALUES(${id},'${entity.id}','${name}','${entity.logo_sm}','${entity.subregion}','${entity.region}',${countryId},'${entity.institution_type}',${entity.stats.n_outputs},${entity.stats.n_outputs_open},${entity.stats.p_outputs_open},${entity.stats.p_outputs_publisher_open_only},${entity.stats.p_outputs_both},${entity.stats.p_outputs_other_platform_open_only},${entity.stats.p_outputs_closed});`,
    );
  });

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

const COUNTRY_COLUMNS =
  "country.id, country.entity_id, country.name, 'country' AS entity_type, country.logo_sm, country.subregion, country.region, country.n_outputs, country.n_outputs_open, country.p_outputs_open, country.p_outputs_publisher_open_only, country.p_outputs_both, country.p_outputs_other_platform_open_only, country.p_outputs_closed";
const INSTITUTION_COLUMNS =
  "institution.id, institution.entity_id, institution.name, 'institution' AS entity_type, institution.logo_sm, institution.subregion, institution.region, country.entity_id AS country_code, country.name as country_name, institution.institution_type, institution.n_outputs, institution.n_outputs_open, institution.p_outputs_open, institution.p_outputs_publisher_open_only, institution.p_outputs_both, institution.p_outputs_other_platform_open_only, institution.p_outputs_closed";

// TODO: used for search
export async function selectEntities(db: D1Database, ids: Array<number>): Promise<Array<Entity>> {
  // Create query
  const paramsTemplate = makeTemplateParams(ids.length);
  const idsAll = ids.concat(ids);

  // Have to explicitly set column names to ensure the same number of columns because of the UNION: SqliteError SELECTs to the left and right of UNION do not have the same number of result columns
  const sql = [];
  sql.push(`SELECT ${COUNTRY_COLUMNS}, NULL AS country_code, NULL AS country_name, NULL AS institution_type`);
  sql.push("FROM country");
  sql.push(`WHERE country.id in (${paramsTemplate})`);
  sql.push("UNION");
  sql.push(`SELECT ${INSTITUTION_COLUMNS}`);
  sql.push("FROM institution");
  sql.push("LEFT JOIN country ON country.id = institution.country_id");
  sql.push(`WHERE institution.id in (${paramsTemplate})`);

  // Run query
  const query = sql.join("\n");
  const stmt = db.prepare(query).bind(...idsAll);
  const { results } = await stmt.all();

  // Put into same order as ids
  const map = new Map<number, Dict>();
  results?.forEach(row => {
    //@ts-ignore
    map.set(row["id"], row);
  });
  const rows: Array<Dict> = ids.map(
    (id: number): Dict => {
      //@ts-ignore
      return map.get(id);
    },
  );

  // Convert to entities
  return rowsToEntities(rows);
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

  // Select specific columns
  if (entityType === "country") {
    sql.push(`SELECT ${COUNTRY_COLUMNS}, total_rows`);
  } else {
    sql.push(`SELECT ${INSTITUTION_COLUMNS}, total_rows`);
  }
  sql.push(`FROM ${entityType}`);
  sql.push(`INNER JOIN (SELECT ${entityType}.id, COUNT(*) OVER() AS total_rows`);
  sql.push(`FROM ${entityType}`);

  if (query.ids.size) {
    // Fetch specific entities
    sql.push("WHERE");
    sql.push(`${entityType}.entity_id IN (${makeTemplateParams(query.ids.size)})`);
    params.push(...Array.from(query.ids));
  } else {
    // Join other tables for institution filtering
    if (entityType === "institution") {
      sql.push("LEFT JOIN country ON institution.country_id = country.id");
    }

    // Setup where statement
    sql.push("WHERE TRUE");

    // // Include if regions parameter specified and matches
    // if (query.regions.size) {
    //   sql.push(`AND ${entityType}.region IN (${makeTemplateParams(query.regions.size)})`);
    //   params.push(...Array.from(query.regions));
    // }

    // Include if n_outputs is between filter values
    sql.push(`AND ${entityType}.n_outputs BETWEEN ? AND ?`);
    params.push(query.minNOutputs);
    params.push(query.maxNOutputs);

    // Include if n_outputs_open is between filter values
    sql.push(`AND ${entityType}.n_outputs_open BETWEEN ? AND ?`);
    params.push(query.minNOutputsOpen);
    params.push(query.maxNOutputsOpen);

    // Include if p_outputs_open is between filter values
    sql.push(`AND ${entityType}.p_outputs_open BETWEEN ? AND ?`);
    params.push(query.minPOutputsOpen);
    params.push(query.maxPOutputsOpen);

    // Include if subregions parameter specified and matches
    if (query.subregions.size) {
      sql.push(`AND ${entityType}.subregion IN (${makeTemplateParams(query.subregions.size)})`);
      params.push(...Array.from(query.subregions));
    }

    // Institution specific filtering
    if (entityType === "institution") {
      // Search for institutions with a specific institution type
      if (query.institutionTypes.size) {
        sql.push(`AND ${entityType}.institution_type IN (${makeTemplateParams(query.institutionTypes.size)})`);
        params.push(...Array.from(query.institutionTypes));
      }

      // Search for institutions in particular countries
      if (query.countries.size) {
        sql.push(`AND country.entity_id IN (${makeTemplateParams(query.countries.size)})`);
        params.push(...Array.from(query.countries));
      }
    }
  }

  // Order by
  let orderBy;
  if (query.orderDir === "asc") {
    orderBy = `ORDER BY ${entityType}.${query.orderBy} ASC`;
  } else {
    orderBy = `ORDER BY ${entityType}.${query.orderBy} DESC`;
  }
  // sql.push(orderBy);

  // Limit and offset
  const limit = query.limit;
  const offset = query.page * query.limit;
  sql.push("LIMIT ? OFFSET ?");
  params.push(limit);
  params.push(offset);

  // Outer query
  sql.push(`) AS subset ON subset.id = ${entityType}.id`);
  if (entityType == "institution") {
    // If institution join with country table to get country entity id and name
    sql.push("LEFT JOIN country ON country.id = institution.country_id");
  }
  sql.push(orderBy);

  // Build query
  const queryString = sql.join("\n");
  console.log(queryString);

  // Run query plan
  const stmt_query_plan = db.prepare("EXPLAIN QUERY PLAN " + queryString).bind(...params);
  const results_query_plan = await stmt_query_plan.all();
  console.log(`QUERY PLAN: ${JSON.stringify(results_query_plan)}`);

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
