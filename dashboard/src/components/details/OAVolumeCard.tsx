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

import { OAVolumeChart } from "@/components/charts";
import { ChartLegend, EntityCard } from "@/components/details";
import { Entity } from "@/lib/model";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface OAVolumeCardProps extends BoxProps {
  entity: Entity;
}

const OAVolumeCard = ({ entity, ...rest }: OAVolumeCardProps) => {
  // Fill time series data with zeros
  let data = [];
  for (let year = entity.start_year; year <= entity.end_year; year++) {
    data.push({
      year: year,
      Open: 0,
      Closed: 0,
    });
  }

  // Merge real data with zeroed data
  let maxOutputs = 0;
  entity.years.forEach((t) => {
    const year = t.publication_year;
    const i = year - entity.start_year;

    if (t.n_outputs > maxOutputs) {
      maxOutputs = t.n_outputs;
    }

    data[i] = {
      year: year,
      Open: t.oa_status.open.total,
      Closed: t.oa_status.closed.total,
    };
  });

  let labels = ["Open", "Closed"];
  let colors = ["#FF671C", "#EBEBEB"];

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Volume of Open Access over time</Text>
      <Box>
        <OAVolumeChart data={data} startYear={entity.start_year} />
        <ChartLegend labels={labels} colors={colors} />
      </Box>
    </EntityCard>
  );
};

export default memo(OAVolumeCard);
