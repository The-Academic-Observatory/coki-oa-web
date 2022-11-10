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
import Head from "next/head";
import Breadcrumbs from "../common/Breadcrumbs";
import lodashGet from "lodash.get";
import { addBuildId } from "../../lib/api";
import OATimeseriesCard from "./OATimeseriesCard";
import PublisherOpenCard from "./PublisherOpenCard";
import OAVolumeCard from "./OAVolumeCard";
import BreakdownCard from "./BreakdownCard";
import Footer from "./Footer";
import SummaryCard from "./SummaryCard";
import OtherPlatformOpenCard from "./OtherPlatformOpenCard";
import OtherPlatformLocationsCard from "./OtherPlatformLocationsCard";

import { useRouter } from "next/router";

export const makeDescription = (entity: Entity) => {
  let text = `Open Access statistics for ${entity.name},`;
  if (entity.category === "institution") {
    text += ` ${entity.country},`;
  }
  text += ` covering academic research published from ${entity.start_year} to ${entity.end_year}.`;
  return text;
};

export interface EntityDetailsProps {
  entity: Entity;
  stats: Stats;
}

export function makeShareImageUrl(entityId: string): string {
  let url = `${process.env.NEXT_PUBLIC_HOST}/twitter/${entityId}.webp`;
  // TODO: Change folder structure to reflect /share/$${entityId}.webp instead
  return addBuildId(url);
}

export function makePageDescription(entity: Entity, stats: Stats): string {
  const pOpen = Math.round(entity.stats.p_outputs_open);
  // When the entity's OA% is over median say Over when under say Only
  let metaDescription = "Over ";
  if (entity.stats.p_outputs_open < lodashGet(stats, `${entity.category}.median`).p_outputs_open) {
    metaDescription = "Only ";
  }
  metaDescription +=
    `${pOpen}% of ${entity.name}'s published academic research is freely available on the internet. ` +
    makeDescription(entity);

  return metaDescription;
}

export const EntityDetails = ({ entity, stats, ...rest }: EntityDetailsProps) => {
  const pageTitle = `COKI: ${entity.name}`;
  const pageDescription = makePageDescription(entity, stats);
  const shareTitle = `${entity.name}'s Open Access Research Performance`;
  const shareImage = makeShareImageUrl(entity.id);
  const pageUrl = `${process.env.NEXT_PUBLIC_HOST}${useRouter().asPath}`; // Get URL of current route

  return (
    <Box layerStyle="page">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Twitter card metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@COKIproject" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={shareImage} />
        <meta name="twitter:image:alt" content={pageDescription} />

        {/* Facebook and LinkedIn card metadata, uses the same twitter card */}
        <meta property="og:title" content={shareTitle} />
        <meta property="og:image" content={shareImage} />
        <meta name="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
      </Head>

      <Breadcrumbs
        breadcrumbs={[
          { title: entity.category, href: `/${entity.category}/` },
          {
            title: entity.name,
            href: `/${entity.category}/${entity.id}/`,
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
