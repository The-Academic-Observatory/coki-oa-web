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

import { EntityCard } from "@/components/details";
import { Entity } from "@/lib/model";
import { toCompactNumber } from "@/lib/utils";
import { Box, BoxProps, Flex, Grid, GridItem, Text, Tooltip } from "@chakra-ui/react";
import React, { memo } from "react";
import { FaBriefcaseMedical, FaFirstdraft, FaUniversity, FaUsers } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

interface OtherPlatformOpenCardProps extends BoxProps {
  entity: Entity;
}

const OtherPlatformOpenCard = ({ entity, ...rest }: OtherPlatformOpenCardProps) => {
  const data = [
    {
      id: "Institution",
      label: "Institution",
      value: entity.oa_status.other_platform_categories.institution.percent,
      total_outputs: entity.oa_status.other_platform_categories.institution.total,
      icon: FaUniversity,
      description: "The percentage of other platform open articles that are available on institutional repositories.",
    },
    {
      id: "Preprint",
      label: "Preprint",
      value: entity.oa_status.other_platform_categories.preprint.percent,
      total_outputs: entity.oa_status.other_platform_categories.preprint.total,
      icon: FaFirstdraft,
      description:
        "The percentage of other platform open articles that are available on preprint repositories, such as arXiv, bioRxiv or medRxiv.",
    },
    {
      id: "Domain",
      label: "Domain",
      value: entity.oa_status.other_platform_categories.domain.percent,
      total_outputs: entity.oa_status.other_platform_categories.domain.total,
      icon: FaBriefcaseMedical,
      description:
        "The percentage of other platform open articles that are available on domain repositories such as PubMed Central, Europe PMC or Econstor.",
    },
    {
      id: "Public",
      label: "Public",
      value: entity.oa_status.other_platform_categories.public.percent,
      total_outputs: entity.oa_status.other_platform_categories.public.total,
      icon: FaUsers,
      description:
        "The percentage of other platform open articles that are available on public repositories, such as Semantic Scholar, Figshare or Zenodo.",
    },
    {
      id: "Other Internet",
      label: "Other Internet",
      value: entity.oa_status.other_platform_categories.other_internet.percent,
      total_outputs: entity.oa_status.other_platform_categories.other_internet.total,
      icon: TbWorld,
      description:
        "The percentage of other platform open articles that are available on the wider internet, including academic staff pages, blogs and unknown sources.",
    },
  ];
  data.sort((a, b) => b.value - a.value);

  // Progress bar variables
  const height = 30;
  const width = 100;
  const viewBox = [0, 0, 100, height];

  return (
    <EntityCard width="full" {...rest}>
      <Text textStyle="entityCardHeading">Other Platform Open</Text>
      <Grid layerStyle="chartKeys" gap={2} mt="12px">
        {data.map((item) => (
          <GridItem key={item.id}>
            <Flex layerStyle="chartKeyRow">
              <Tooltip
                variant="dashboard"
                hasArrow
                label={item.description}
                aria-label={item.description}
                placement="top-start"
                bg="tooltip.other_platform"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Box pr="6px" pb="1px">
                    <item.icon color="#79a161" />
                  </Box>

                  <Text textStyle="chartKeyHeader">
                    {item.label} {item.value.toFixed(0)}%
                  </Text>
                </Flex>
              </Tooltip>

              <Text textStyle="chartKeyDescription">{toCompactNumber(item.total_outputs)}</Text>
            </Flex>

            {/*Use an SVG for the bars rather an HTML progress because it is less of a pain to style across platforms */}
            <svg width="100%" height={`${height}px`} viewBox={viewBox.join(" ")} preserveAspectRatio="none">
              <rect x={0} width={item.value} height={height} fill="url(#otherPlatformGradient)" />
              <rect x={item.value} width={width - item.value} height={height} fill="#EBEBEB" />
              <defs>
                <linearGradient id="otherPlatformGradient">
                  <stop offset="0%" stopColor="#8acb67" />
                  <stop offset="100%" stopColor="rgba(178, 219, 152, 0.89)" />
                </linearGradient>
              </defs>
            </svg>
          </GridItem>
        ))}
      </Grid>
    </EntityCard>
  );
};

export default memo(OtherPlatformOpenCard);
