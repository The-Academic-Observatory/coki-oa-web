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
// Author: Aniek Roelofs, James Diprose

import React, { memo } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { HistogramChart } from "@/components/charts";
import { FilterRangeSlider } from "@/components/filter";
import { Histogram } from "@/lib/model";

export interface HistogramRangeSliderProps {
  leftKey: string;
  rightKey: string;
  min: number;
  max: number;
  histogram: Histogram;
  unit?: string;
  height?: number;
  forwardTransform?: (val: number) => number;
  inverseTransform?: (val: number) => number;
}

const HistogramRangeSlider = ({
  leftKey,
  rightKey,
  min,
  max,
  histogram,
  unit,
  height = 40,
  forwardTransform = (val) => val,
  inverseTransform = (val) => val,
}: HistogramRangeSliderProps) => {
  return (
    <VStack>
      <Box position="relative" width="100%">
        <HistogramChart position="absolute" histogram={histogram} min={min} max={max} height={height} />
        <FilterRangeSlider
          leftKey={leftKey}
          rightKey={rightKey}
          min={min}
          max={max}
          unit={unit}
          forwardTransform={forwardTransform}
          inverseTransform={inverseTransform}
        />
      </Box>
    </VStack>
  );
};

export default memo(HistogramRangeSlider);
