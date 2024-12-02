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
  country_code: string;
  country_name: string;
  institution_type: string;
  acronyms: Array<string>;
  start_year: number;
  end_year: number;
  n_citations: number;
  n_outputs: number;
  oa_status: OAStatus;
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
  publisher_only: Metric;
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

export type Year = {
  publication_year: number;
  date: string;
  n_citations: number;
  n_outputs: number;
  oa_status: OAStatus;
};

export type ZenodoVersion = {
  release_date: string;
  download_url: string;
};

export type SummaryMetrics = {
  p_outputs_open: number;
  n_outputs: number;
  n_outputs_open: number;
};

export type EntityStats = {
  n_items: number;
  min: SummaryMetrics;
  max: SummaryMetrics;
  median: SummaryMetrics;
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
