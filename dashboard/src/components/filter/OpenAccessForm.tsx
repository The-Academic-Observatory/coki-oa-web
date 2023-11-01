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

import { HistogramRangeSlider, OpenAccess } from "@/components/filter";
import { EntityHistograms } from "@/lib/model";
import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React, { memo, useCallback } from "react";
import { toCompactNumber, fromCompactNumber } from "@/lib/utils";

export interface OpenAccessFormProps {
  rangeSliderMinMaxValues: OpenAccess;
  histograms: EntityHistograms;
}

const paddingLr = "24px";

const OpenAccessForm = ({ rangeSliderMinMaxValues, histograms }: OpenAccessFormProps) => {
  const forwardTransform = useCallback((val: number) => {
    // Convert to log10 distribution
    return Math.log10(val + 1);
  }, []);
  const inverseTransform = useCallback((val: number) => {
    // Convert from log10 distribution back to standard distribution
    // Round to nearest whole number so that we don't get decimal numbers
    val = Math.round(Math.pow(10, val) - 1); //

    // To ensure that the numbers set in the form match what the user sees on the screen, convert to compact
    // number representation and back again
    return fromCompactNumber(toCompactNumber(val));
  }, []);

  return (
    <VStack align="stretch" spacing={0}>
      <Box m={0} p={`18px ${paddingLr} 6px`}>
        <Text textStyle="filterSubheader">Open Access Percentage</Text>
        <HistogramRangeSlider
          leftKey="openAccess.minPOutputsOpen"
          rightKey="openAccess.maxPOutputsOpen"
          min={rangeSliderMinMaxValues.minPOutputsOpen}
          max={rangeSliderMinMaxValues.maxPOutputsOpen}
          histogram={histograms.p_outputs_open}
          unit="%"
        />
      </Box>
      <Divider marginLeft={{ base: 0, md: `${paddingLr} !important` }} />
      <Box m={0} p={`18px ${paddingLr} 16px`}>
        <Text textStyle="filterSubheader">Total Publications</Text>
        <HistogramRangeSlider
          leftKey="openAccess.minNOutputs"
          rightKey="openAccess.maxNOutputs"
          min={rangeSliderMinMaxValues.minNOutputs}
          max={rangeSliderMinMaxValues.maxNOutputs}
          histogram={histograms.n_outputs}
          forwardTransform={forwardTransform}
          inverseTransform={inverseTransform}
        />
      </Box>
      <Divider marginLeft={{ base: 0, md: `${paddingLr} !important` }} />
      <Box m={0} p={`18px ${paddingLr} 18px`}>
        <Text textStyle="filterSubheader">Total Open Publications</Text>
        <HistogramRangeSlider
          leftKey="openAccess.minNOutputsOpen"
          rightKey="openAccess.maxNOutputsOpen"
          min={rangeSliderMinMaxValues.minNOutputsOpen}
          max={rangeSliderMinMaxValues.maxNOutputsOpen}
          histogram={histograms.n_outputs_open}
          forwardTransform={forwardTransform}
          inverseTransform={inverseTransform}
        />
      </Box>
    </VStack>
  );
};

export default memo(OpenAccessForm);
