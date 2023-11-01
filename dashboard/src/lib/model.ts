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

export type Entity = {
  id: string;
  name: string;
  description: Description;
  entity_type: string;
  logo_sm: string;
  logo_md: string;
  logo_lg: string;
  url: string;
  wikipedia_url: string;
  region: string;
  subregion: string;
  country_name: string;
  country_code: string;
  institution_type: string;
  start_year: number;
  end_year: number;
  stats: PublicationStats;
  identifiers: Array<Identifier>;
  years: Array<Year>;
  repositories: Array<Repository>;
};

export type Description = {
  text: string;
  url: string;
  license: string;
};

export type Repository = {
  id: string;
  total_outputs: number;
  category: string;
  home_repo: boolean;
};

export type PublicationStats = {
  n_citations: number;
  n_outputs: number;
  n_outputs_open: number;
  n_outputs_publisher_open: number;
  n_outputs_publisher_open_only: number;
  n_outputs_both: number;
  n_outputs_other_platform_open: number;
  n_outputs_other_platform_open_only: number;
  n_outputs_closed: number;
  n_outputs_oa_journal: number;
  n_outputs_hybrid: number;
  n_outputs_no_guarantees: number;
  n_outputs_preprint: number;
  n_outputs_domain: number;
  n_outputs_institution: number;
  n_outputs_public: number;
  n_outputs_other_internet: number;
  n_outputs_black: number;
  p_outputs_open: number;
  p_outputs_publisher_open: number;
  p_outputs_publisher_open_only: number;
  p_outputs_both: number;
  p_outputs_other_platform_open: number;
  p_outputs_other_platform_open_only: number;
  p_outputs_closed: number;
  p_outputs_oa_journal: number;
  p_outputs_hybrid: number;
  p_outputs_no_guarantees: number;
  p_outputs_preprint: number;
  p_outputs_domain: number;
  p_outputs_institution: number;
  p_outputs_public: number;
  p_outputs_other_internet: number;
  p_outputs_black: number;
};

export type Identifier = {
  id: string;
  type: string;
};

export type Year = {
  year: number;
  date: string;
  stats: PublicationStats;
};

export type ZenodoVersion = {
  release_date: string;
  download_url: string;
};

export type EntityStats = {
  n_items: number;
  min: PublicationStats;
  max: PublicationStats;
  median: PublicationStats;
  histograms: EntityHistograms;
};

export type EntityHistograms = {
  p_outputs_open: Histogram;
  n_outputs: Histogram;
  n_outputs_open: Histogram;
};

export type Histogram = {
  data: Array<number>;
  bins: Array<number>;
};

export type Stats = {
  start_year: number;
  end_year: number;
  last_updated: string;
  zenodo_versions: Array<ZenodoVersion>;
  country: EntityStats;
  institution: EntityStats;
};

export interface QueryResult {
  items: Array<Entity>;
  nItems: number;
  nPages: number;
  page: number;
  limit: number;
  orderBy: string;
  orderDir: string;
  minNOutputs: number;
  maxNOutputs: number;
  minNOutputsOpen: number;
  maxNOutputsOpen: number;
  minPOutputsOpen: number;
  maxPOutputsOpen: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDir?: string;
  countries?: Array<string>;
  subregions?: Array<string>;
  institutionTypes?: Array<string>;
  minNOutputs?: number;
  maxNOutputs?: number;
  minNOutputsOpen?: number;
  maxNOutputsOpen?: number;
  minPOutputsOpen?: number;
  maxPOutputsOpen?: number;
}

export interface Dict {
  [key: string]: any;
}
