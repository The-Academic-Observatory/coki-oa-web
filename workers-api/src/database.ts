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

import { Dict, Entity, Query } from "@/types";
//@ts-ignore
import fs from "fs";

const SCHEMA = `
DROP TABLE IF EXISTS institution_institution_type;
DROP TABLE IF EXISTS institution;
DROP TABLE IF EXISTS country;

CREATE TABLE country (
    id INTEGER NOT NULL,
    entity_id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    logo_s varchar(255) NOT NULL,
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

CREATE TABLE institution (
    id INTEGER NOT NULL,
    entity_id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    logo_s varchar(255) NOT NULL,
    country_id INTEGER NOT NULL,
    subregion varchar(255) NOT NULL,
    region varchar(255) NOT NULL,
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

CREATE TABLE institution_institution_type (
    id INTEGER NOT NULL,
    institution_type varchar(255) NOT NULL,
    
    PRIMARY KEY (id, institution_type),
    UNIQUE (id, institution_type),
    FOREIGN KEY (id) REFERENCES institution(id)
);
`;

export function generateSQL(countryPath: string, institutionPath: string, outputPath: string) {
  // Generate the SQL for the database
  const countries: Array<Entity> = JSON.parse(fs.readFileSync(countryPath));
  const institutions: Array<Entity> = JSON.parse(fs.readFileSync(institutionPath));

  // Add schema
  const rows = [SCHEMA];

  // Generate country SQL
  const countryMap = new Map<string, number>();
  rows.push(
    "INSERT INTO country (id, entity_id, name, logo_s, subregion, region, n_outputs, n_outputs_open, p_outputs_open, p_outputs_publisher_open_only, p_outputs_both, p_outputs_other_platform_open_only, p_outputs_closed)",
  );
  rows.push("VALUES");
  countries.forEach((entity, id) => {
    const name = entity.name.replaceAll("'", "''");
    rows.push(
      `(${id}, '${entity.id}', '${name}', '${entity.logo_s}', '${entity.subregion}', '${entity.region}', ${entity.stats.n_outputs}, ${entity.stats.n_outputs_open}, ${entity.stats.p_outputs_open}, ${entity.stats.p_outputs_publisher_open_only}, ${entity.stats.p_outputs_both}, ${entity.stats.p_outputs_other_platform_open_only}, ${entity.stats.p_outputs_closed}),`,
    );
    countryMap.set(entity.id, id);
  });
  rows[rows.length - 1] = `${rows[rows.length - 1].slice(0, -1)};`;

  // Generate institution SQL
  rows.push("");
  rows.push(
    "INSERT INTO institution (id, entity_id, name, logo_s, country_id, subregion, region, n_outputs, n_outputs_open, p_outputs_open, p_outputs_publisher_open_only, p_outputs_both, p_outputs_other_platform_open_only, p_outputs_closed)",
  );
  rows.push("VALUES");
  institutions.forEach((entity, i) => {
    const id = countries.length + i;
    const name = entity.name.replaceAll("'", "''");
    if (entity.country_code === undefined) {
      throw `Institution ${entity.id}, ${entity.name} does not have a country_code`;
    }
    const countryId = countryMap.get(entity.country_code);
    rows.push(
      `(${id}, '${entity.id}', '${name}', '${entity.logo_s}', ${countryId}, '${entity.subregion}', '${entity.region}', ${entity.stats.n_outputs}, ${entity.stats.n_outputs_open}, ${entity.stats.p_outputs_open}, ${entity.stats.p_outputs_publisher_open_only}, ${entity.stats.p_outputs_both}, ${entity.stats.p_outputs_other_platform_open_only}, ${entity.stats.p_outputs_closed}),`,
    );
  });
  rows[rows.length - 1] = `${rows[rows.length - 1].slice(0, -1)};`;

  // Generate institution_institution_type SQL
  rows.push("");
  rows.push("INSERT INTO institution_institution_type (id, institution_type)");
  rows.push("VALUES");
  institutions.forEach((entity, i) => {
    const id = countries.length + i;
    entity.institution_types?.forEach((institution_type) => {
      rows.push(`(${id}, '${institution_type}'),`);
    });
  });
  rows[rows.length - 1] = `${rows[rows.length - 1].slice(0, -1)};`;

  // Save to file
  const sql = rows.join("\n");
  fs.writeFileSync(outputPath, sql);
}

export function rowsToEntities(rows: Array<Dict<any>>): Array<Entity> {
  const entities: Array<Entity> = [];
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];

    // Set id
    row["id"] = row["entity_id"];
    delete row.entity_id;

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

    // Delete the unnested properties
    delete row.n_outputs;
    delete row.n_outputs_open;
    delete row.p_outputs_open;
    delete row.p_outputs_publisher_open_only;
    delete row.p_outputs_both;
    delete row.p_outputs_other_platform_open_only;
    delete row.p_outputs_closed;

    // Delete total rows
    if (row.total_rows !== undefined) {
      delete row.total_rows;
    }

    // Delete country id
    if (row.country_id !== undefined) {
      delete row.country_id;
    }

    entities.push(row as Entity);
  }

  return entities;
}

function makeTemplateParams(n: number) {
  return Array(n).fill("?").join(",");
}

export async function selectEntities(db: D1Database, ids: Array<number>) {
  // Create query
  const paramsTemplate = makeTemplateParams(ids.length);
  const idsAll = ids.concat(ids);
  const countryColumns = `id, entity_id, name, 'country' AS category, logo_s, subregion, region, n_outputs, n_outputs_open, p_outputs_open, p_outputs_publisher_open_only, p_outputs_both, p_outputs_other_platform_open_only, p_outputs_closed`;
  const institutionColumns = `id, entity_id, name, 'institution' AS category, logo_s, subregion, region, n_outputs, n_outputs_open, p_outputs_open, p_outputs_publisher_open_only, p_outputs_both, p_outputs_other_platform_open_only, p_outputs_closed`;
  const query = `SELECT ${countryColumns} FROM country WHERE country.id in (${paramsTemplate}) UNION SELECT ${institutionColumns} FROM institution WHERE institution.id in (${paramsTemplate}) `;

  // Run query
  const stmt = db.prepare(query).bind(...idsAll);
  const { results } = await stmt.all();

  // Put into same order as ids
  const map = new Map<number, Dict<any>>();
  results?.forEach((row) => {
    //@ts-ignore
    map.set(row["id"], row);
  });
  const rows: Array<Dict<any>> = ids.map((id: number): Dict<any> => {
    //@ts-ignore
    return map.get(id);
  });

  // Convert to entities
  return rowsToEntities(rows);
}

const VALID_CATEGORIES = new Set(["country", "institution"]);
const VALID_ORDER_BY = new Set(["name", "n_outputs", "n_outputs_open", "p_outputs_open"]);

export async function filterEntities(db: D1Database, query: Query) {
  // Validate parameters that are string substituted without using .bind
  if (!VALID_CATEGORIES.has(query.category)) {
    const msg = `filterResults: invalid category ${query.category}`;
    console.error(msg);
    throw msg;
  }
  if (!VALID_ORDER_BY.has(query.orderBy)) {
    const msg = `filterResults: invalid orderBy ${query.orderBy}`;
    console.error(msg);
    throw msg;
  }

  // Build query
  const sql = [
    `SELECT * FROM ${query.category} INNER JOIN (SELECT ${query.category}.id, COUNT(*) OVER() AS total_rows FROM ${query.category}`,
  ];
  let params: Array<any> = [];

  if (query.ids.size) {
    // Fetch specific entities
    sql.push("WHERE");
    sql.push(`${query.category}.entity_id IN (${makeTemplateParams(query.ids.size)})`);
    params = params.concat(Array.from(query.ids));
  } else {
    // Join other tables for institution filtering
    if (query.category === "institution") {
      sql.push("LEFT JOIN country ON institution.country_id = country.id");
      sql.push("LEFT JOIN institution_institution_type ON institution.id = institution_institution_type.id");
    }

    // Setup where statement
    sql.push("WHERE TRUE");

    // Include if regions parameter specified and matches
    if (query.regions.size) {
      sql.push(`AND ${query.category}.region IN (${makeTemplateParams(query.regions.size)})`);
      params = params.concat(Array.from(query.regions));
    }

    // Include if subregions parameter specified and matches
    if (query.subregions.size) {
      sql.push(`AND ${query.category}.subregion IN (${makeTemplateParams(query.subregions.size)})`);
      params = params.concat(Array.from(query.subregions));
    }

    // Institution specific filtering
    if (query.category === "institution") {
      // Search for institutions in particular countries
      if (query.countries.size) {
        sql.push(`AND country.country_code IN (${makeTemplateParams(query.countries.size)})`);
        params = params.concat(Array.from(query.countries));
      }

      // Search for institutions with a specific institution type
      if (query.institutionTypes.size) {
        sql.push(
          `AND institution_institution_type.institution_type IN (${makeTemplateParams(query.institutionTypes.size)})`,
        );
        params = params.concat(Array.from(query.institutionTypes));
      }
    }

    // Include if n_outputs is between filter values
    sql.push(`AND ${query.category}.n_outputs BETWEEN ? AND ?`);
    params.push(query.minNOutputs);
    params.push(query.maxNOutputs);

    // Include if n_outputs_open is between filter values
    sql.push(`AND ${query.category}.n_outputs_open BETWEEN ? AND ?`);
    params.push(query.minNOutputsOpen);
    params.push(query.maxNOutputsOpen);

    // Include if p_outputs_open is between filter values
    sql.push(`AND ${query.category}.p_outputs_open BETWEEN ? AND ?`);
    params.push(query.minPOutputsOpen);
    params.push(query.maxPOutputsOpen);
  }

  // Order by
  let orderBy;
  if (query.orderDir === "asc") {
    orderBy = `ORDER BY ${query.category}.${query.orderBy} ASC`;
  } else {
    orderBy = `ORDER BY ${query.category}.${query.orderBy} DESC`;
  }
  sql.push(orderBy);

  // Limit and offset
  const limit = query.limit;
  const offset = query.page * query.limit;
  sql.push("LIMIT ? OFFSET ?");
  params.push(limit);
  params.push(offset);

  // Outer query
  sql.push(`) AS subset ON subset.id = ${query.category}.id`);
  sql.push(orderBy);

  // Run query
  const queryString = sql.join(" ");
  console.log(queryString);
  const stmt = db.prepare(queryString).bind(...params);
  const { results } = await stmt.all();

  // Get total rows
  let nItems = 0;
  if (results?.length) {
    // @ts-ignore
    nItems = results[0]["total_rows"];
  }

  // Parse results
  const entities: Array<Entity> = rowsToEntities(results as Array<Dict<any>>);

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

//`;
//
// // Filtering functions
// export async function filterResults(query: Query) {
//   // TODO: separate query into an interface, where D1 or PlanetScale could be used
//   // TODO: get total results
//
//   // Build query
//   const sql = [
//     `SELECT * FROM ${query.category} INNER JOIN (SELECT id, COUNT(*) OVER() AS total_rows FROM ${query.category} WHERE TRUE`,
//   ];
//   let params: Array<any> = [];
//
//   if (query.ids.size) {
//     // Fetch specific entities
//     sql.push(`AND entity_id IN (${makeTemplateParams(query.ids.size)})`);
//     params = params.concat(Array.from(query.ids));
//   } else {
//     // Include if regions parameter specified and matches
//     if (query.regions.size) {
//       sql.push(`AND region IN (${makeTemplateParams(query.regions.size)})`);
//       params = params.concat(Array.from(query.regions));
//     }
//
//     // Include if subregions parameter specified and matches
//     if (query.subregions.size) {
//       sql.push(`AND subregion IN (${makeTemplateParams(query.subregions.size)})`);
//       params = params.concat(Array.from(query.subregions));
//     }
//
//     // Include if countries parameter specified and matches: institution by country filter
//     // TODO: filter institutions by country (think this is done)
//     // if (query.countries.size) {
//     //   sql.push(SqlString.format("AND country IN (?)", [Array.from(query.countries)]));
//     // }
//
//     // TODO: Check if any institutionTypes match types in entity.institution_types
//
//     // Include if n_outputs is between filter values
//     sql.push("AND n_outputs BETWEEN ? AND ?");
//     params = params.concat([query.minNOutputs, query.maxNOutputs]);
//
//     // Include if n_outputs_open is between filter values
//     sql.push("AND n_outputs_open BETWEEN ? AND ?");
//     params = params.concat([query.minNOutputsOpen, query.maxNOutputsOpen]);
//
//     // Include if p_outputs_open is between filter values
//     sql.push("AND p_outputs_open BETWEEN ? AND ?");
//     params = params.concat([query.minPOutputsOpen, query.maxPOutputsOpen]);
//   }
//
//   // Order by
//   let orderBy = SqlString.format("ORDER BY ?? ASC", [query.orderBy]); // Escape id
//   if (query.orderDir === "dsc") {
//     orderBy = SqlString.format("ORDER BY ?? DESC", [query.orderBy]); // Escape id
//   }
//   sql.push(orderBy);
//
//   // Limit and offset
//   const limit = query.limit;
//   const offset = query.page * query.limit;
//   sql.push(SqlString.format("LIMIT ? OFFSET ?", [limit, offset]));
//
//   // Outer query
//   sql.push(") AS subset ON entity.id = subset.id");
//   sql.push(orderBy);
//
//   // Run query
//   const sql_str = sql.join(" ");
//   console.log(sql_str);
//   const conn = client.connection();
//   const response = await conn.execute(sql_str);
//
//   // Parse results
//   const entities: Array<Entity> = tableRowsToEntities(response.rows);
//
//   // Make final search object
//   return {
//     items: entities,
//     nItems: 100,
//     page: query.page,
//     limit: query.limit,
//     orderBy: query.orderBy,
//     orderDir: query.orderDir,
//   };
// }
