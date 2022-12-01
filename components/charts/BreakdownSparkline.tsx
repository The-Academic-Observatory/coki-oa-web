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

import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import React, { memo } from "react";

export type Rect = {
  x: number;
  width: number;
  color: string;
};

function calcRects(values: Array<number>, colors: Array<string>, width: number): Array<Rect> {
  let rects = [];
  const total = values.reduce((sum: number, n: number) => sum + n, 0);

  let x = 0;
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    let color = colors[i];
    let rectWidth = (value / total) * width;
    let rect: Rect = {
      x: x,
      width: rectWidth,
      color: color,
    };
    rects.push(rect);
    x += rectWidth;
  }

  return rects;
}

interface Props extends BoxProps {
  values: Array<number>;
  colors: Array<string>;
  width: any;
  height: number;
  labels: Array<string>;
}

const BreakdownSparkline = ({ values, colors, width, height, labels, ...rest }: Props) => {
  // Bar chart calculation
  const virtualWidth = 100;
  const viewBox = [0, 0, virtualWidth, height];
  const rects = calcRects(values, colors, virtualWidth);

  // Create text
  let element = <></>;
  if (labels !== null) {
    element = (
      <Flex w="full" alignItems="center" justifyContent="space-between">
        {labels.map((label, i) => (
          <Box key={label}>
            <Text textStyle="breakdownHeading">{label}</Text>
            <Text textStyle="breakdownValue">{values[i]}%</Text>
          </Box>
        ))}
      </Flex>
    );
  }

  // The text included below is for the Google results of the website.
  // The rect is only rendered in the svg, only the text should appear
  // in the Google search results.
  const valueSummary: string = values.map((value) => `${Math.round(value)}%`).join(" ");

  return (
    <Box {...rest}>
      <svg width={width} height={height} viewBox={viewBox.join(" ")} preserveAspectRatio="none">
        {valueSummary}
        {rects.map((rect, i) => (
          <rect key={i} x={rect.x} width={rect.width} height={height} fill={rect.color} />
        ))}
      </svg>
      {element}
    </Box>
  );
};

BreakdownSparkline.defaultProps = {
  labels: null,
};

export default memo(BreakdownSparkline);
