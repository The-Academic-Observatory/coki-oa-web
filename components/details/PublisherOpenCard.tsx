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

import { Box, BoxProps, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import React, { memo } from "react";
import PublisherOpenDonut from "../charts/PublisherOpenDonut";
import EntityCard from "./EntityCard";

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
    },
    {
      id: "Hybrid",
      label: "Hybrid",
      value: stats.p_outputs_hybrid,
      color: "#ffd700",
    },
    {
      id: "No Guarantees",
      label: "No Guarantees",
      value: stats.p_outputs_no_guarantees,
      color: "#f8eb8f",
    },
  ];
  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Publisher Open</Text>
      <Flex w={"full"} flexDirection={{ base: "column", md: "row" }} alignItems="center" justifyContent="center">
        <PublisherOpenDonut data={data} />
        <Grid layerStyle="chartKeys">
          <GridItem borderTop="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundImage="linear-gradient(-135deg, #fdd500, #b9a436)" />
              <Text textStyle="chartKeyHeader">OA Journal</Text>
              <Text textStyle="chartKeyDescription" display={{ base: "none", sm: "block" }}>
                &nbsp;- published in open access journal
              </Text>
            </Flex>
          </GridItem>
          <GridItem borderTop="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundColor="#ffd700" />
              <Text textStyle="chartKeyHeader">Hybrid</Text>
              <Text textStyle="chartKeyDescription" display={{ base: "none", sm: "block" }}>
                &nbsp;- subscription publisher, open license
              </Text>
            </Flex>
          </GridItem>
          <GridItem borderTop="2px solid #EBEBEB" borderBottom="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundColor="#f8eb8f" />
              <Text textStyle="chartKeyHeader">No Guarantees</Text>
              <Text textStyle="chartKeyDescription" display={{ base: "none", sm: "block" }}>
                &nbsp;- subscription publisher, no reuse rights
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </EntityCard>
  );
};

export default memo(PublisherOpenCard);
