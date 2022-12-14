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

import { Entity } from "../../../lib/model";
import { OADataLocal, idsToStaticPaths } from "../../../lib/api";
import SocialCard from "../../../components/common/SocialCard";

type Props = {
  entity: Entity;
};

export default function InstitutionCard({ entity }: Props) {
  return <SocialCard entity={entity} />;
}

type Params = {
  params: {
    entityType: string;
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  if (process.env.NODE_ENV === "development") {
    const client = new OADataLocal();
    const entity = client.getEntity(params.entityType, params.id);
    return {
      props: {
        entity: entity,
      },
    };
  } else {
    return {};
  }
}

export async function getStaticPaths() {
  if (process.env.NODE_ENV === "development") {
    const client = new OADataLocal();
    const countryPaths = idsToStaticPaths(
      client.getEntities("country").map((e: Entity) => e.id),
      "country",
    );
    const institutionPaths = idsToStaticPaths(
      client.getEntities("institution").map((e: Entity) => e.id),
      "institution",
    );
    const paths = countryPaths.concat(institutionPaths);

    return {
      paths: paths,
      fallback: false,
    };
  } else {
    return {
      paths: [],
      fallback: false,
    };
  }
}
