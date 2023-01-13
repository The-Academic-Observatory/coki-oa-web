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

import { Entity, Stats } from "../../lib/model";
import { idsToStaticPaths, OADataLocal, OADataAPI } from "../../lib/api";
import EntityDetails from "../../components/details/EntityDetails";
import topInstitutions from "../../data/topInstitutions.json";

const MAX_PREVIEW_INSTITUTIONS = 100;

type Props = {
  entity: Entity;
  stats: Stats;
};

export default function EntityDetailsPage({ entity, stats }: Props) {
  return <EntityDetails entity={entity} stats={stats} />;
}

type Params = {
  params: {
    entityType: string;
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  // Use REST API to fetch data for entities as this function can be called
  // at build time or run time for ISR (for blocking fallback pages).
  const client = new OADataAPI();
  const entity = await client.getEntity(params.entityType, params.id);
  const stats = client.getStats();
  return {
    props: {
      entity: entity,
      stats: stats,
    },
  };
}

export async function getStaticPaths() {
  // Use local API as this is only ever called during build
  const client = new OADataLocal();

  // Pre-render all country pages
  const countryPaths = idsToStaticPaths(
    client.getEntities("country").map((e: Entity) => e.id),
    "country",
  );

  // Pre-render the most viewed institutions
  let institutionIds = topInstitutions;
  if (process.env.COKI_ENVIRONMENT !== "production") {
    institutionIds = institutionIds.slice(0, MAX_PREVIEW_INSTITUTIONS);
  }
  const institutionPaths = idsToStaticPaths(institutionIds, "institution");

  // All paths to render
  const paths = countryPaths.concat(institutionPaths);

  return {
    paths: paths,
    fallback: "blocking",
  };
}
