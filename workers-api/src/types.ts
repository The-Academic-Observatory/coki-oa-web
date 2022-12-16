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
  country: string | null;
  institution_type: string | null;
  acronyms: Array<string>;
  stats: PublicationStats;
}

export interface PublicationStats extends Object {
  n_outputs: number;
  n_outputs_open: number;
  p_outputs_open: number;
  p_outputs_publisher_open_only: number;
  p_outputs_both: number;
  p_outputs_other_platform_open_only: number;
  p_outputs_closed: number;
}

export type PageSettings = {
  page: number;
  limit: number;
  orderBy: string;
  orderDir: string;
};

export type Query = {
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
