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

import { useD3 } from "@/lib/hooks";
import { Histogram } from "@/lib/model";
import { Box, BoxProps } from "@chakra-ui/react";
import * as d3 from "d3";
import React, { memo } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface HistogramChartProps extends BoxProps {
  histogram: Histogram;
  min: number;
  max: number;
  width?: number;
  height?: number;
  color?: string;
}

const HistogramChart = ({
  histogram,
  min,
  max,
  width = 100,
  height = 100,
  color = "#e8e8e8",
  ...rest
}: HistogramChartProps) => {
  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement | null, any, any, any>) => {
      const x = d3
        .scaleLinear()
        // @ts-ignore max could be undefined
        .domain([min, max])
        .range([0, width]);

      const y = d3
        .scaleLinear()
        // @ts-ignore max could be undefined
        .domain([d3.min(histogram.data), d3.max(histogram.data)])
        .range([height, 0]);

      // Create chart
      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "none")
        .attr("fill", color)
        .selectAll(".bar")
        .data(histogram.data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d, index) => {
          return x(histogram.bins[index]);
        })
        .attr("width", (d, index) => {
          const cur = x(histogram.bins[index]);
          const next = x(histogram.bins[index + 1]);
          return next - cur;
        })
        .attr("y", (d) => y(d))
        .attr("height", (d) => {
          return height - y(d);
        });
    },
    [histogram, height],
  );

  return (
    <Box {...rest} width="100%">
      <svg
        ref={ref}
        style={{
          height: height,
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
        }}
      />
    </Box>
  );
};

export default memo(HistogramChart);
