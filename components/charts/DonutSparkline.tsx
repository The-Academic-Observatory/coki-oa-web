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

import { HStack, StackProps, Text } from "@chakra-ui/react";
import { memo } from "react";

function calcDonutSettings(value: number, color: string, strokeWidth = 5, size = 24) {
  let r = (size - strokeWidth) / 2;
  let c = size / 2.0;
  let circumference = 2 * Math.PI * r;
  let seg1 = (value / 100.0) * circumference;
  let seg2 = circumference - seg1;
  let bgOffset = 0.25 * circumference; // move 25% anti-clockwise
  let fgOffset = seg2 + bgOffset;
  let bgStrokeDasharray: Array<number> = [seg1, seg2];
  let fgStrokeDasharray: Array<number> = [seg2, seg1];

  return {
    strokeWidth: strokeWidth,
    size: size,
    r: r,
    c: c,
    circumference: circumference,
    bgStrokeDasharray: bgStrokeDasharray,
    fgStrokeDasharray: fgStrokeDasharray,
    bgOffset: bgOffset,
    fgOffset: fgOffset,
  };
}

interface Props extends StackProps {
  value: number;
  color: string;
  size: number;
  showText?: Boolean;
}

const DonutSparkline = ({ value, color, size, showText = true, ...rest }: Props) => {
  let s = calcDonutSettings(value, color);

  let text = <></>;
  if (showText) {
    text = <Text>{Math.round(value)}%</Text>;
  }

  return (
    <HStack spacing={1} {...rest}>
      {text}
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle
          cx={s.c}
          cy={s.c}
          fillOpacity="0"
          r={s.r}
          stroke={color}
          strokeDasharray={s.bgStrokeDasharray.join(" ")}
          strokeDashoffset={s.bgOffset}
          strokeWidth={s.strokeWidth}
        />
        <circle
          cx={s.c}
          cy={s.c}
          fillOpacity={0}
          r={s.r}
          stroke="#ededed"
          strokeDasharray={s.fgStrokeDasharray.join(" ")}
          strokeDashoffset={s.fgOffset}
          strokeWidth={s.strokeWidth}
        />
      </svg>
    </HStack>
  );
};

export default memo(DonutSparkline);
