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

import { Obj, Request } from "itty-router";
import { Limit, SearchOptions } from "flexsearch";

export interface Entity extends Object {
  id: string;
  name: string;
  category: string;
  logo_s: string;
  region: string;
  subregion: string;
  country_code?: string;
  country_name?: string;
  institution_types?: Array<string>;
  acronyms?: Array<string>;
  stats: {
    n_outputs: number;
    n_outputs_open: number;
    p_outputs_open: number;
    p_outputs_publisher_open_only: number;
    p_outputs_both: number;
    p_outputs_other_platform_open_only: number;
    p_outputs_closed: number;
  };
}

export type Query = {
  category: string;
  ids: Set<string>;
  countries: Set<string>;
  subregions: Set<string>;
  regions: Set<string>;
  institutionTypes: Set<string>;
  minNOutputs: number;
  maxNOutputs: number;
  minNOutputsOpen: number;
  maxNOutputsOpen: number;
  minPOutputsOpen: number;
  maxPOutputsOpen: number;
  page: number;
  limit: number;
  orderBy: string;
  orderDir: string;
};

type MethodType = "GET";

export interface SearchRequest extends Request {
  method: MethodType;
  url: string;
  params: {
    text: string;
  };
  query: {
    limit: string;
  };
}

export interface EntityRequest extends Request {
  method: MethodType;
  url: string;
  params: {
    id: string;
  };
  query: {};
}

export interface FilterRequest extends Omit<Request, "query"> {
  method: MethodType;
  url: string;
  params: Obj;
  query: FilterQuery;
}

export interface FilterQuery {
  page?: string;
  limit?: string;
  orderBy?: string;
  orderDir?: string;
  ids?: string;
  countries?: string;
  subregions?: string;
  regions?: string;
  institutionTypes?: string;
  minNOutputs?: string;
  maxNOutputs?: string;
  minNOutputsOpen?: string;
  maxNOutputsOpen?: string;
  minPOutputsOpen?: string;
  maxPOutputsOpen?: string;
}

export interface QueryResult {
  items: Array<Entity>;
  nItems: number;
  page: number;
  limit: number;
  orderBy: string;
  orderDir: string;
}

export interface Dict<T> {
  [key: string]: T;
}

export interface FlexSearchIndex {
  add(id: number, item: string): this;
  search(query: string, options?: Limit | SearchOptions): Array<number>;
  export(handler: (key: string, value: string) => void): Promise<void>;
  import(key: string, item: Object): Promise<void>;
}
