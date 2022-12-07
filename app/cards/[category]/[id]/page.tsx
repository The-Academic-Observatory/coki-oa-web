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

import { getEntityIds, quantizeEntityPercentages } from "../../../../lib/api";
import SocialCard from "../../../../components/common/SocialCard";
import { Entity } from "../../../../lib/model";
import ChakraLayout from "../../../../components/layout/ChakraLayout";

type Props = {
  params: {
    category: string;
    id: string;
  };
};

async function getEntity(category: string, id: string): Promise<Entity> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/${category}/${id}`);
  const entity = await response.json();
  quantizeEntityPercentages(entity);
  return entity;
}

export default async function Card({ params }: Props) {
  const entity = await getEntity(params.category, params.id);
  return (
    <ChakraLayout>
      <SocialCard entity={entity} />
    </ChakraLayout>
  );
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
  return idsToStaticPaths("country", getEntityIds("country")).concat(
    idsToStaticPaths("institution", getEntityIds("institution")),
  );
}
