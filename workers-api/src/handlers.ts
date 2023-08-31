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
// Author: James Diprose, Alex Massen-Hane

import JSZip from "jszip";
import { Parser } from "@json2csv/plainjs";
import { flatten } from "@json2csv/transforms";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import { Entity, EntityRequest, FilesToZipType, FilterQuery, FilterRequest, Query, SearchRequest } from "@/types";
import { filterEntities, searchEntities } from "@/database";

export const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-type": "application/json",
};
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;
const MIN_OUTPUTS = 0;
const MIN_OUTPUTS_OPEN = 0;

export const fetchEntityHandler = async (req: EntityRequest, env: Bindings, ctx: ExecutionContext) => {
  const url = new URL(req.url);
  const entityType = req.params.entityType;
  if (!["country", "institution"].includes(entityType)) {
    throw Error(`fetchEntityHandler invalid entityType: ${entityType}`);
  }
  const entityId = req.params.id;
  const assetPath = `${entityType}/${entityId}.json`;
  const kvKey = JSON.parse(manifestJSON)[assetPath];

  console.log(
    `fetchEntityHandler: pathname=${url.pathname}, entityType=${entityType}, entityId=${entityId}, assetPath=${assetPath}, kvKey=${kvKey}`,
  );

  // Fetch data from KV
  // Use a stream because it is the fastest, and we don't need to parse the JSON data
  const data = await env.__STATIC_CONTENT.get(kvKey, { type: "stream" });
  if (data !== null) {
    // Return response with data
    return new Response(data, {
      headers: HEADERS,
    });
  }

  // No data file found, return 404 not found
  return new Response("Not found", {
    status: 404,
    headers: HEADERS,
  });
};

export const parseQuery = (q: FilterQuery): Query => {
  // Parse query params
  let ids = q.ids === undefined ? new Set<string>() : new Set<string>(q.ids.split(","));
  let countries = q.countries === undefined ? new Set<string>() : new Set<string>(q.countries.split(","));
  let subregions = q.subregions === undefined ? new Set<string>() : new Set<string>(q.subregions.split(","));
  let regions = q.regions === undefined ? new Set<string>() : new Set<string>(q.regions.split(","));
  let institutionTypes =
    q.institutionTypes === undefined ? new Set<string>() : new Set<string>(q.institutionTypes.split(","));

  let minNOutputs = q.minNOutputs === undefined ? MIN_OUTPUTS : parseInt(q.minNOutputs);
  minNOutputs = Math.max(minNOutputs, MIN_OUTPUTS);
  let maxNOutputs = q.maxNOutputs === undefined ? Number.MAX_VALUE : parseInt(q.maxNOutputs);
  maxNOutputs = Math.max(maxNOutputs, MIN_OUTPUTS);
  let minNOutputsOpen = q.minNOutputsOpen === undefined ? MIN_OUTPUTS_OPEN : parseInt(q.minNOutputsOpen);
  minNOutputsOpen = Math.max(minNOutputsOpen, MIN_OUTPUTS_OPEN);
  let maxNOutputsOpen = q.maxNOutputsOpen === undefined ? Number.MAX_VALUE : parseInt(q.maxNOutputsOpen);
  maxNOutputsOpen = Math.max(maxNOutputsOpen, MIN_OUTPUTS_OPEN);
  let minPOutputsOpen = q.minPOutputsOpen === undefined ? 0 : parseInt(q.minPOutputsOpen);
  minPOutputsOpen = Math.min(Math.max(minPOutputsOpen, 0), 100);
  let maxPOutputsOpen = q.maxPOutputsOpen === undefined ? 100 : parseInt(q.maxPOutputsOpen);
  maxPOutputsOpen = Math.max(Math.min(maxPOutputsOpen, 100), 0);

  // Parse page settings
  let page = q.page === undefined ? 0 : parseInt(q.page);
  let limit = q.limit === undefined ? MAX_LIMIT : parseInt(q.limit);
  page = Math.max(page, 0);
  limit = Math.max(Math.min(limit, MAX_LIMIT), MIN_LIMIT);
  let orderBy = q.orderBy || "p_outputs_open";
  let orderDir = q.orderDir || "dsc";

  return {
    ids: ids,
    countries: countries,
    subregions: subregions,
    regions: regions,
    institutionTypes: institutionTypes,
    minNOutputs: minNOutputs,
    maxNOutputs: maxNOutputs,
    minNOutputsOpen: minNOutputsOpen,
    maxNOutputsOpen: maxNOutputsOpen,
    minPOutputsOpen: minPOutputsOpen,
    maxPOutputsOpen: maxPOutputsOpen,
    page: page,
    limit: limit,
    orderBy: orderBy,
    orderDir: orderDir,
  };
};

const getDatabaseBinding = (env: Bindings): D1Database => {
  if (env.DB !== undefined) {
    return env.DB;
  } else if (env.__D1_BETA__DB !== undefined) {
    return env.__D1_BETA__DB;
  }
  throw new Error("getDatabaseBinding: no database binding found");
};

export const filterEntitiesHandler = async (
  entityType: string,
  req: FilterRequest,
  env: Bindings,
  ctx?: ExecutionContext,
) => {
  const q = req["query"];
  const query = parseQuery(q);

  // Fetch data
  const results = await filterEntities(entityType, getDatabaseBinding(env), query);

  // Convert to JSON, returning results
  const json = JSON.stringify(results);
  return new Response(json, {
    headers: HEADERS,
  });
};

export const searchHandler = async (req: SearchRequest, env: Bindings, ctx: ExecutionContext) => {
  // Parse parameters and query
  const text = decodeURIComponent(req.params.text);
  const acronym = req.query.acronym === "true";
  let page = parseInt(req.query.page) || 0;
  let limit = parseInt(req.query.limit) || MAX_LIMIT;
  limit = Math.max(Math.min(limit, MAX_LIMIT), MIN_LIMIT);

  // Convert returned ids to objects
  const results = await searchEntities(getDatabaseBinding(env), text, acronym, page, limit);

  // Convert to JSON, returning results
  const json = JSON.stringify(results);
  return new Response(json, {
    headers: HEADERS,
  });
};

export const downloadDataHandler = async (req: EntityRequest, env: Bindings) => {
  const entityType = req.params.entityType;
  const entityId = req.params.id;

  if (!["country", "institution"].includes(entityType)) {
    throw Error(`downloadDataZipHandler invalid entityType: ${entityType}`);
  }

  // Fetch data from KV
  const assetPath = `${entityType}/${entityId}.json`;
  const kvKey = JSON.parse(manifestJSON)[assetPath];
  let entity: Entity | null;
  try {
    entity = await env.__STATIC_CONTENT.get(kvKey, { type: "json" });
  } catch {
    entity = null;
  }

  // Data exists, let API hand off data in zip.
  if (entity !== null) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${entity.name} COKI Dataset.zip`,
    };

    // Transform data into CSV files. Need a separate parser for each due to the entity structure.
    const parserYears = new Parser({ transforms: [flatten({ objects: true })] });
    const parserRepos = new Parser();

    let filesToZip: Array<FilesToZipType> = [
      {
        fileName: `years.csv`,
        fileData: parserYears.parse(entity.years),
      },
      {
        fileName: `repositories.csv`,
        fileData: parserRepos.parse(entity.repositories),
      },
      {
        fileName: "README.md",
        fileData: createReadmeMarkdown(entity),
      },
    ];

    // Generate the CSVs and zip them.
    const zip = new JSZip();
    for (const file of filesToZip) {
      zip.file(file.fileName, file.fileData);
    }
    let promise = zip.generateAsync({ type: "blob", compression: "DEFLATE" });

    // Respond to API call with the requested ZIP file.
    return new Response(await promise, {
      status: 200,
      headers: headers,
    });
  }

  // Entity was not found.
  return new Response("Not found", {
    status: 404,
    headers: HEADERS,
  });
};

export const createReadmeMarkdown = async (entity: Entity) => {
  // No indent in this large string otherwise it shows up in the exported markdown file.
  let text: string = `# COKI Open Access Dataset
This zip package contains only a subset of aggregated data from the COKI Open Access Dataset for ${entity.name} 
in CSV format, between the years of ${entity.start_year} and ${entity.end_year}.

## License
[COKI Open Access Dataset](https://open.coki.ac/data/) (c) 2022 by [Curtin University](https://www.curtin.edu.au/)
is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Citing
To cite the COKI Open Access Dashboard please use the following citation:
> Diprose, J., Hosking, R., Rigoni, R., Roelofs, A., Chien, T., Napier, K., Wilson, K., Huang, C., Handcock, R., Montgomery, L., & Neylon, C. (2023). A User-Friendly Dashboard for Tracking Global Open Access Performance. The Journal of Electronic Publishing 26(1). doi: https://doi.org/10.3998/jep.3398

If you use the website code, please cite it as below:
> James P. Diprose, Richard Hosking, Richard Rigoni, Aniek Roelofs, Alex Massen-Hane, Kathryn R. Napier, Tuan-Yow Chien, Katie S. Wilson, Lucy Montgomery, & Cameron Neylon. (2022). COKI Open Access Website. Zenodo. https://doi.org/10.5281/zenodo.6374486

If you use this dataset, please cite it as below:
> Richard Hosking, James P. Diprose, Aniek Roelofs, Tuan-Yow Chien, Lucy Montgomery, & Cameron Neylon. (2022). COKI Open Access Dataset [Data set]. Zenodo. https://doi.org/10.5281/zenodo.6399462

## Attributions
The COKI Open Access Dataset contains information from:
* [OpenAlex](https://openalex.org/) which is made available under a [CC0 licence](https://creativecommons.org/share-your-work/public-domain/cc0/).
* [Crossref Metadata](https://www.crossref.org/documentation/metadata-plus/) via the Metadata Plus program. Bibliographic metadata is made available without copyright restriction and Crossref generated data with a [CC0 licence](https://creativecommons.org/share-your-work/public-domain/cc0/). See [metadata licence information](https://www.crossref.org/documentation/retrieve-metadata/rest-api/rest-api-metadata-license-information/) for more details.
* [Unpaywall](https://unpaywall.org/). The [Unpaywall Data Feed](https://unpaywall.org/products/data-feed) is used under license. Data is freely available from Unpaywall via the API, data dumps and as a data feed.
* [Research Organization Registry](https://ror.org/) which is made available under a [CC0 licence](https://creativecommons.org/share-your-work/public-domain/cc0/).
`;
  return text;
};
