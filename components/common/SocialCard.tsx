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

import React, { memo, ReactElement } from "react";
import { Box, BoxProps, Flex, HStack, Image, StackProps, Text, VStack } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import DonutSparkline from "../charts/DonutSparkline";
import styles from "./SocialCard.module.css";
import { toReadableNumber } from "../../lib/utils";
import COKISmall from "../../public/logo-small.svg";

interface ShareCardProps extends BoxProps {
  entity: Entity;
}

interface StatsProps extends StackProps {
  statsTitle: ReactElement;
  value: number;
  isPercent?: boolean;
}

const Stats = ({ statsTitle, value, isPercent, ...rest }: StatsProps) => {
  let percent = "";
  if (isPercent) {
    percent = "%";
  }

  return (
    <VStack alignItems={"left"} spacing="0" {...rest}>
      <hr className={styles.hrSub} />
      <Text textStyle="entityStatsHeading" fontSize="24px" lineHeight="24px" pb="6px">
        {statsTitle}
      </Text>
      <Text textStyle="entityStatsValue" fontSize="56px" lineHeight="56px">
        {toReadableNumber(value)}
        {percent}
      </Text>
    </VStack>
  );
};

const SocialCard = ({ entity, ...rest }: ShareCardProps) => {
  const pOpen = Math.round(entity.stats.p_outputs_open);
  let titleFontSize = -1 * entity.name.length + 70;
  titleFontSize = Math.min(Math.max(titleFontSize, 32), 70);

  return (
    <Box className="socialCard" width="1200px" height="628px" p="48px">
      <HStack>
        <Image
          rounded="48px"
          objectFit="cover"
          boxSize={{ base: "532px" }}
          src={entity.logo_xl}
          alt={entity.name}
          style={{
            filter: "drop-shadow( 0px 0px 12px rgba(0, 0, 0, .3))",
          }}
        />
        <Flex w="full" pl="48px" height="532px" flexDirection="column" justifyContent="space-between">
          <VStack align="left" gap="24px">
            <Text as="h1" textStyle="entityHeading" fontSize={`${titleFontSize}px`} lineHeight={`${titleFontSize}px`}>
              {entity.name}
            </Text>
            <Flex alignItems="center">
              <DonutSparkline value={pOpen} color={"#FF671C"} size={180} showText={false} pr={2} />
              <VStack alignItems={"left"} spacing="0">
                <hr className={styles.hrMain} />
                <Text textStyle="entityOAScoreHeading" fontSize="32px" lineHeight="32px" pb="6px">
                  Open Access
                </Text>
                <Text textStyle="entityOAScoreValue" fontSize="96px" lineHeight="96px">
                  {pOpen}%
                </Text>
              </VStack>
            </Flex>
            <Flex pt="12px" w="full" alignItems="center" justifyContent="space-between">
              <Stats statsTitle={<>Publications</>} value={entity.stats.n_outputs} />
              <Stats statsTitle={<>Open</>} value={entity.stats.n_outputs_open} />
              <Stats statsTitle={<>Citations</>} value={entity.stats.n_citations} />
            </Flex>
          </VStack>

          <Flex w="full" justifyContent="end" flexDirection="row">
            <COKISmall
              style={{
                width: "112px",
              }}
            />
          </Flex>
        </Flex>
      </HStack>
    </Box>
  );
};

export default memo(SocialCard);
