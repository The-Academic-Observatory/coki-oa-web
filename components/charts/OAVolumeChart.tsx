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

import { BoxProps } from "@chakra-ui/react";
import { AxisLegendPosition } from "@nivo/axes";
import { Bar } from "@nivo/bar";
import React, { memo } from "react";

interface OAVolumeChartProps extends BoxProps {
  data: Array<any>;
  startYear: number;
}

export function formatVolumeChartYAxis(value: number) {
  if (value < 1e3) {
    return value;
  } else if (value < 1e9) {
    value = value / 1000;
    return `${value}k`;
  }
}

const OAVolumeChart = ({ data, startYear, ...rest }: OAVolumeChartProps) => {
  let labels = ["Open", "Closed"];
  let colors = ["#FF671C", "#EBEBEB"];
  const props = {
    data: data,
    keys: labels,
    indexBy: "year",
    margin: { top: 20, right: 20, bottom: 30, left: 53 },
    enableGridX: false,
    enableGridY: true,
    colors: colors,
    width: 740,
    enableLabel: false,
    height: 400,
    isInteractive: true,
    axisLeft: {
      format: (value: number) => {
        return formatVolumeChartYAxis(value);
      },
      legend: "Total Publications",
      legendPosition: "middle" as AxisLegendPosition,
      legendOffset: -48,
    },
  };

  return (
    <div style={{ display: "flex" }}>
      <Bar {...props} layers={["axes"]} axisBottom={null} width={60} margin={{ ...props.margin, left: 60 }} />
      <div style={{ overflowX: "auto", overflowY: "hidden", direction: "rtl", width: 740 }}>
        <Bar {...props} axisLeft={null} margin={{ ...props.margin, left: 0 }} />
      </div>
    </div>
  );
};

export default memo(OAVolumeChart);
