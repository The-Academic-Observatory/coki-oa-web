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

// "use client";

import { getEntityIds, quantizeEntityPercentages } from "../../../../lib/api";
import SocialCard from "../../../../components/common/SocialCard";
import { Entity } from "../../../../lib/model";
import { join } from "path";
import fs from "fs";

type Props = {
  params: {
    category: string;
    id: string;
  };
};

async function getEntity(category: string, id: string) {
  const response = await fetch(`${}/`);
  const entity = await response.json();
  quantizeEntityPercentages(entity);
  return entity;
}

export default async function Card({ params }: Props) {
  const entity = await getEntity(params.category, params.id);
  return <SocialCard entity={entity} />;
  //
  // console.log(entity.name);

  return <h1>Hello!</h1>;
}

export function idsToStaticPaths(category: string, ids: Array<string>) {
  return ids.map((entityId) => {
    return {
      category: category,
      id: entityId,
    };
  });
}

export async function generateStaticParams() {
  console.log("generateStaticParams");

  return idsToStaticPaths("country", getEntityIds("country")).concat(
    idsToStaticPaths("institution", getEntityIds("institution")),
  );
}
