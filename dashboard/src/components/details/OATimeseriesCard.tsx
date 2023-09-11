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

import { OAPercentageChart } from "@/components/charts";
import { ChartLegend, EntityCard } from "@/components/details";
import { Entity } from "@/lib/model";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface OATimeseriesCardProps extends BoxProps {
  entity: Entity;
}

const OATimeseriesCard = ({ entity, ...rest }: OATimeseriesCardProps) => {
  // Fill time series data with zeros
  let data = [];
  for (let year = entity.start_year; year <= entity.end_year; year++) {
    data.push({
      "Publisher Open": 0,
      Both: 0,
      "Other Platform Open": 0,
      Closed: 0,
    });
  }

  // Merge real data with zeroed data
  entity.years.forEach((t) => {
    const year = t.year;
    const stats = t.stats;
    const i = year - entity.start_year;

    data[i] = {
      "Publisher Open": stats.p_outputs_publisher_open_only,
      Both: stats.p_outputs_both,
      "Other Platform Open": stats.p_outputs_other_platform_open_only,
      Closed: stats.p_outputs_closed,
    };
  });

  const labels = ["Publisher Open", "Both", "Other Platform Open", "Closed"];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Percentage of Open Access over time</Text>
      <Box>
        <OAPercentageChart data={data} startYear={entity.start_year} />
        <ChartLegend labels={labels} colors={colors} />
      </Box>
    </EntityCard>
  );
};

export default memo(OATimeseriesCard);
