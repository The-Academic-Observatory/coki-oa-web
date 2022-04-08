import dataRaw from "../../latest/data/index.json";
import flexsearch from "flexsearch";
import { Entity, SearchRequest } from "./types";
const data = dataRaw as Array<Entity>;

const { Index } = flexsearch;

const index = new Index({
  language: "en",
  tokenize: "forward",
});
data.forEach((item: Entity, i: number) => {
  // id, text
  // Array index is id and used later on to access the real document
  const name = item.name;
  index.add(i, name);
});
const minLimit = 1;
const maxLimit = 20;

export const search = (text: string, limit: number) => {
  // Search index
  const ids = index.search(text, limit);

  // Convert returned ids to objects
  //@ts-ignore
  return ids.map((i: number) => {
    return data[i];
  });
};

export const searchHandler = (req: SearchRequest) => {
  // Parse parameters and query
  const text = decodeURIComponent(req.params.text);
  let limit = parseInt(req.query.limit) || maxLimit;
  limit = Math.max(Math.min(limit, maxLimit), minLimit);

  // Convert returned ids to objects
  const results = search(text, limit);

  // Convert to JSON, returning results
  const json = JSON.stringify(results);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  };
  return new Response(json, {
    headers: headers,
  });
};
