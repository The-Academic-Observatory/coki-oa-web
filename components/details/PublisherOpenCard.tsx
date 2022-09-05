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

import { Box, BoxProps, Flex, Grid, GridItem, Text, Tooltip } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import React, { memo } from "react";
import PublisherOpenDonut from "../charts/PublisherOpenDonut";
import EntityCard from "./EntityCard";

const numberFormat = Intl.NumberFormat("en", { notation: "compact" });

interface PublisherOpenCardProps extends BoxProps {
  entity: Entity;
}

const PublisherOpenCard = ({ entity, ...rest }: PublisherOpenCardProps) => {
  const stats = entity.stats;
  const data = [
    {
      id: "OA Journal",
      label: "OA Journal",
      value: stats.p_outputs_oa_journal,
      color: "#d5bd40",
      description: "The percentage of publisher open articles that are published in open access journals.",
      backgroundImage: "linear-gradient(-135deg, #fdd500, #b9a436)",
      total_outputs: stats.n_outputs_oa_journal,
    },
    {
      id: "Hybrid",
      label: "Hybrid",
      value: stats.p_outputs_hybrid,
      color: "#ffd700",
      description: "The percentage of publisher open articles from subscription publishers, with an open license.",
      total_outputs: stats.n_outputs_hybrid,
    },
    {
      id: "No Guarantees",
      label: "No Guarantees",
      value: stats.p_outputs_no_guarantees,
      color: "#f8eb8f",
      description: "The percentage of publisher open articles from subscription publishers, with no reuse rights.",
      total_outputs: stats.n_outputs_no_guarantees,
    },
  ];
  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Publisher Open</Text>
      <Flex w="full" alignItems="center" flexDirection="column" justifyContent="center" mb={{ base: "12px", sm: 0 }}>
        <PublisherOpenDonut data={data} />
        <Grid layerStyle="chartKeys">
          {data.map((item) => (
            <GridItem key={item.id} borderTop="1px solid #EBEBEB" _last={{ borderBottom: "1px solid #EBEBEB" }}>
              <Flex layerStyle="chartKeyRow">
                <Tooltip
                  variant="dashboard"
                  hasArrow
                  label={item.description}
                  aria-label={item.description}
                  placement="top-start"
                  bg="tooltip.publisher"
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box layerStyle="chartKeyBox" backgroundColor={item.color} />
                    <Text textStyle="chartKeyHeader">
                      {item.label}&nbsp;{item.value.toFixed(0)}%
                    </Text>
                  </Flex>
                </Tooltip>
                <Text textStyle="chartKeyDescription">{numberFormat.format(item.total_outputs)}</Text>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </EntityCard>
  );
};

export default memo(PublisherOpenCard);
