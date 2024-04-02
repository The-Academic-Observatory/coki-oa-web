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

import { BreakdownSparkline } from "@/components/charts";
import { EntityCard } from "@/components/details";
import { Entity } from "@/lib/model";
import { BoxProps, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface BreakdownCardProps extends BoxProps {
  entity: Entity;
}

const BreakdownCard = ({ entity, ...rest }: BreakdownCardProps) => {
  const values = [
    entity.oa_status.publisher_only.percent,
    entity.oa_status.both.percent,
    entity.oa_status.other_platform_only.percent,
    entity.oa_status.closed.percent,
  ];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];
  const labels = ["Publisher Open", "Both", "Other Platform Open", "Closed"];

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Breakdown</Text>
      <BreakdownSparkline values={values} colors={colors} width={"100%"} height={48} py={3} labels={labels} />
    </EntityCard>
  );
};

export default memo(BreakdownCard);
