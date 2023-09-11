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
import { AreaCurve } from "@nivo/core";
import { Stream } from "@nivo/stream";
import React, { memo } from "react";

interface OAPercentageChartProps extends BoxProps {
  data: Array<any>;
  startYear: number;
}

const OAPercentageChart = ({ data, startYear, ...rest }: OAPercentageChartProps) => {
  let curve: AreaCurve = "monotoneX";
  const props = {
    data: data,
    keys: ["Publisher Open", "Both", "Other Platform Open", "Closed"],
    margin: { top: 20, right: 20, bottom: 30, left: 37 },
    enableGridX: true,
    enableGridY: false,
    colors: ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"],
    colorBy: "index",
    fillOpacity: 0.8,
    width: 740,
    height: 400,
    axisLeft: {
      format: (value: number) => {
        return `${value}%`;
      },
    },
    axisBottom: {
      format: (value: number) => {
        return startYear + value;
      },
    },
    valueFormat: (value: number) => `${value.toFixed(0)}%`,
    curve: curve,
  };

  return (
    <div style={{ display: "flex" }}>
      <Stream
        {...props}
        layers={["axes"]}
        axisBottom={null}
        width={40}
        margin={{ ...props.margin, left: 40 }}
        offsetType="none"
      />
      <div style={{ overflowX: "auto", overflowY: "hidden", direction: "rtl", width: 740 }}>
        <Stream {...props} axisLeft={null} margin={{ ...props.margin, left: 0 }} offsetType="none" />
      </div>
    </div>
  );
};

export default memo(OAPercentageChart);
