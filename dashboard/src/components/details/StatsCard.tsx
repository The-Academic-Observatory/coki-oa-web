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

import { DonutSparkline } from "@/components/charts";
import { EntityCard } from "@/components/details";
import { Entity } from "@/lib/model";
import { toReadableNumber } from "@/lib/utils";
import { Box, BoxProps, Flex, Grid, StackProps, Text, VStack } from "@chakra-ui/react";
import React, { memo, ReactElement } from "react";
import styles from "./EntityDetails.module.css";

interface StatsCardProps extends BoxProps {
  entity: Entity;
}

interface StatsProps extends StackProps {
  statsTitle: ReactElement;
  value: number;
  isPercent?: boolean;
}

const Stat = ({ statsTitle, value, isPercent, ...rest }: StatsProps) => {
  let percent = "";
  if (isPercent) {
    percent = "%";
  }

  return (
    <VStack alignItems={"left"} spacing="0" {...rest}>
      <hr className={styles.hr} />
      <Text textStyle="entityStatsHeading" pb={"6px"}>
        {statsTitle}
      </Text>
      <Text textStyle="entityStatsValue">
        {toReadableNumber(value)}
        {percent}
      </Text>
    </VStack>
  );
};

const StatsCard = ({ entity, ...rest }: StatsCardProps) => {
  let titleOpenPercentNoBr = <>Open Access Percentage</>;
  let titleOpenPercent = (
    <>
      Open Access <br /> Percentage
    </>
  );
  let titleNOutputs = (
    <>
      Total <br /> Publications
    </>
  );
  let titleNOutputsOpen = (
    <>
      Total Open <br /> Publications
    </>
  );
  let titleNCitations = (
    <>
      Total <br /> Citations
    </>
  );
  const p_open = Math.round(entity.stats.p_outputs_open);
  return (
    <Box {...rest}>
      {/*base*/}
      <VStack display={{ base: "block", md: "none" }}>
        <EntityCard w={"full"}>
          <Flex justifyContent="center">
            <Flex alignItems="center">
              <DonutSparkline value={p_open} color={"#FF671C"} size={90} showText={false} pr={6} />
              <VStack alignItems={"left"} spacing="0">
                <hr className={styles.hr} />
                <Text textStyle="entityOAScoreHeading" pb={"6px"}>
                  {titleOpenPercentNoBr}
                </Text>
                <Text textStyle="entityOAScoreValue">{p_open}%</Text>
              </VStack>
            </Flex>
          </Flex>
        </EntityCard>

        <Grid gap={2} templateColumns="repeat(3, 1fr)">
          <EntityCard>
            <Stat statsTitle={titleNOutputs} value={entity.stats.n_outputs} />
          </EntityCard>

          <EntityCard>
            <Stat statsTitle={titleNOutputsOpen} value={entity.stats.n_outputs_open} />
          </EntityCard>

          <EntityCard>
            <Stat statsTitle={titleNCitations} value={entity.stats.n_citations} />
          </EntityCard>
        </Grid>
      </VStack>

      {/*sm*/}
      <EntityCard display={{ base: "none", md: "block" }}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" pr={"10px"}>
            <DonutSparkline value={p_open} color={"#FF671C"} size={90} showText={false} pr={6} />
            <Stat statsTitle={titleOpenPercent} value={p_open} isPercent />
          </Flex>
          <Stat statsTitle={titleNOutputs} value={entity.stats.n_outputs} pr={"10px"} />
          <Stat statsTitle={titleNOutputsOpen} value={entity.stats.n_outputs_open} pr={"10px"} />
          <Stat statsTitle={titleNCitations} value={entity.stats.n_citations} />
        </Flex>
      </EntityCard>
    </Box>
  );
};

export default memo(StatsCard);
