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
import { idsToStaticPaths, OADataLocal } from "../../lib/api";
import EntityDetails from "../../components/details/EntityDetails";

const ENTITY_TYPE = "country";

type Props = {
  entity: Entity;
  stats: Stats;
};

export default function Country({ entity, stats }: Props) {
  return <EntityDetails entity={entity} stats={stats} />;
}

type Params = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const client = new OADataLocal();
  const entity = client.getEntity(ENTITY_TYPE, params.id);
  const stats = client.getStats();
  return {
    props: {
      entity: entity,
      stats: stats,
    },
  };
}

export async function getStaticPaths() {
  const client = new OADataLocal();
  const ids = client.getEntities(ENTITY_TYPE).map((e: Entity) => e.id);

  return {
    paths: idsToStaticPaths(ids),
    fallback: false,
  };
}
