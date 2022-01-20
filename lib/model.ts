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
  description: string;
  category: string;
  logo_s: string;
  logo_l: string;
  url: string;
  wikipedia_url: string;
  region: string;
  subregion: string;
  country: string;
  institution_types: Array<string>;
  stats: PublicationStats;
  identifiers: Array<Identifier>;
  collaborators: Array<Collaborator>;
  subjects: Array<Subject>;
  other_platform_locations: Array<string>;
  timeseries: Array<Year>;
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
};

export type Subject = {
  name: string;
  n_outputs: number;
};

export type Collaborator = {
  name: string;
  n_outputs: number;
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
