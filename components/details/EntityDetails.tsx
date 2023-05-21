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

import React, { memo } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { Entity, Stats } from "../../lib/model";
import Card from "../common/Card";
import Breadcrumbs from "../common/Breadcrumbs";
import lodashGet from "lodash.get";
import { cokiImageLoader, addBuildId } from "../../lib/api";
import OATimeseriesCard from "./OATimeseriesCard";
import PublisherOpenCard from "./PublisherOpenCard";
import OAVolumeCard from "./OAVolumeCard";
import BreakdownCard from "./BreakdownCard";
import Footer from "./Footer";
import SummaryCard from "./SummaryCard";
import OtherPlatformOpenCard from "./OtherPlatformOpenCard";
import OtherPlatformLocationsCard from "./OtherPlatformLocationsCard";
import Head from "../common/Head";

export const makeDescription = (
  entity: Pick<Entity, "name" | "entity_type" | "country_name" | "start_year" | "end_year">,
) => {
  let text = `Open Access statistics for ${entity.name},`;
  if (entity.entity_type === "institution") {
    text += ` ${entity.country_name},`;
  }
  text += ` covering academic research published from ${entity.start_year} to ${entity.end_year}.`;
  return text;
};

export interface EntityDetailsProps {
  entity: Entity;
  stats: Stats;
}

export function makeSocialCardUrl(entityId: string): string {
  let url = cokiImageLoader(`social-cards/${entityId}.jpg`);
  return addBuildId(url);
}

export function makePageDescription(
  entity: Pick<Entity, "stats" | "entity_type" | "name" | "country_name" | "start_year" | "end_year">,
  stats: Stats,
): string {
  const pOpen = Math.round(entity.stats.p_outputs_open);
  // When the entity's OA% is over median say Over when under don't add any prefix
  let metaDescription = "Over ";
  const median_p_outputs_open = lodashGet(stats, `${entity.entity_type}.median.p_outputs_open`);
  if (median_p_outputs_open === undefined || entity.stats.p_outputs_open < median_p_outputs_open) {
    metaDescription = "";
  }
  metaDescription +=
    `${pOpen}% of ${entity.name}'s published academic research is freely available on the internet. ` +
    makeDescription(entity);

  return metaDescription;
}

export const EntityDetails = ({ entity, stats, ...rest }: EntityDetailsProps) => {
  const title = `COKI: ${entity.name}`;
  const description = makePageDescription(entity, stats);

  const shareTitle = `${entity.name}'s Open Access Research Performance`;
  const shareImage = makeSocialCardUrl(entity.id);

  return (
    <Box layerStyle="page">
      {/* This component contains the Head tag for the page. */}
      <Head
        title={title}
        description={description}
        shareTitle={shareTitle}
        shareImage={shareImage}
        shareImageType="image/jpeg"
      >
        {/* Preload the entity logo */}
        <link rel="preload" href={cokiImageLoader(entity.logo_md)} as="image" />
      </Head>

      <Breadcrumbs
        breadcrumbs={[
          { title: entity.entity_type, href: `/${entity.entity_type}/` },
          {
            title: entity.name,
            href: `/${entity.entity_type}/${entity.id}/`,
          },
        ]}
      />

      <Card bgBase="none" maxWidth="100vw">
        <VStack spacing={{ base: "8px", sm: "18px", md: "24px" }}>
          <SummaryCard entity={entity} />
          <BreakdownCard entity={entity} />
          <OATimeseriesCard entity={entity} />
          <OAVolumeCard entity={entity} />
          <Flex w="full" flexDirection="row" flexWrap="wrap" gap={{ base: "8px", sm: "18px", md: "24px" }}>
            <PublisherOpenCard entity={entity} display="flex" flexDirection="column" flexBasis="100%" flex={1} />
            <OtherPlatformOpenCard entity={entity} display="flex" flexDirection="column" flexBasis="100%" flex={1} />
          </Flex>
          <OtherPlatformLocationsCard entity={entity} />
          <Footer entity={entity} stats={stats} />
        </VStack>
      </Card>
    </Box>
  );
};

export default memo(EntityDetails);
