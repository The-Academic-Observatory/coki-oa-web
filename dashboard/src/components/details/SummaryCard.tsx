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

import { Header, MetadataCard, StatsCard } from "@/components/details";
import { Entity } from "@/lib/model";
import { Flex, FlexProps } from "@chakra-ui/react";
import React, { memo } from "react";

interface SummaryCardProps extends FlexProps {
  entity: Entity;
}

const SummaryCard = ({ entity, ...rest }: SummaryCardProps) => {
  return (
    <Flex width={"full"} {...rest}>
      <Flex flex={1} flexDirection={"column"} pr={{ base: 0, md: "24px" }}>
        <Header flexGrow={1} entity={entity} />
        <StatsCard entity={entity} />
      </Flex>
      <MetadataCard entity={entity} width={"220px"} display={{ base: "none", md: "block" }} isMobile={false} />
    </Flex>
  );
};

export default memo(SummaryCard);
