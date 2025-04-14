// Copyright 2022-2024 Curtin University
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
  n_outputs: number;
  oa_status: OAStatus;
  years: Array<Year>;
  repositories: Array<Repository>;
  start_year: number;
  end_year: number;
}

export type Year = {
  year: number;
  date: string;
  n_citations: number;
  n_outputs: number;
  oa_status: OAStatus;
};

export type Repository = {
  id: string;
  display_name: string;
  category: string;
  ror_ids: Array<string>;
  country_code: string;
  home_repo: boolean;
  n_outputs: number;
};

export type Metric = {
  total: number;
  percent: number;
};

export type OAStatus = {
  open: Metric;
  closed: Metric;
  publisher: Metric;
  other_platform: Metric;
  both: Metric;
  other_platform_only: Metric;
  publisher_categories: {
    oa_journal: Metric;
    hybrid: Metric;
    no_guarantees: Metric;
  };
  other_platform_categories: {
    preprint: Metric;
    domain: Metric;
    institution: Metric;
    public: Metric;
    other_internet: Metric;
  };
};

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
    entityType?: string;
    orderBy?: string;
    orderDir?: string;
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
  nPages: number;
  limit: number;
  orderBy?: string;
  orderDir?: string;
}
