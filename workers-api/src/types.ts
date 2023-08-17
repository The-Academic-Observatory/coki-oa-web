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

import { Request, Obj } from "itty-router";

export interface Entity extends Object {
  id: string;
  name: string;
  entity_type: string;
  logo_sm: string;
  region: string;
  subregion: string;
  country_code?: string;
  country_name?: string;
  institution_type?: string;
  acronyms?: Array<string>;
  stats: PublicationStats;
  years: Array<Year>;
  repositories: Array<Repository>;
  start_year: number;
  end_year: number;
}

export interface PublicationStats extends Object, Dict {
  n_outputs: number;
  n_outputs_open: number;
  n_outputs_black: number;
  p_outputs_open: number;
  p_outputs_publisher_open_only: number;
  p_outputs_both: number;
  p_outputs_other_platform_open_only: number;
  p_outputs_closed: number;
  p_outputs_black: number;
}

export interface Year {
  year: number;
  date: string;
  stats: PublicationStats;
}

export interface Repository extends Dict {
  id: string;
  total_outputs: number;
  entity_type: string;
  home_repo: boolean;
}

export type Query = {
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
    acronym: string;
    page: string;
    limit: string;
  };
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

export interface EntityRequest extends Request {
  method: MethodType;
  url: string;
  params: {
    entityType: string;
    id: string;
  };
  query: {};
}

export interface FilesToZipType {
  fileName: string;
  fileData: Promise<string>;
}

export interface Dict {
  [key: string]: any;
}

export interface QueryResult {
  items: Array<Entity>;
  nItems: number;
  page: number;
  limit: number;
  orderBy?: string;
  orderDir?: string;
}
