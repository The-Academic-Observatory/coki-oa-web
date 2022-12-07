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

import {
  Flex,
  Text,
  VStack,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { getIn, useFormikContext } from "formik";

import { QueryForm } from "./FilterForm";
import React, { memo, useCallback, useEffect } from "react";
import { toReadableNumber } from "../../lib/utils";

export interface FilterRangeSliderProps {
  leftKey: string;
  rightKey: string;
  min: number;
  max: number;
  unit?: string;
  forwardTransform?: (val: number) => number;
  inverseTransform?: (val: number) => number;
  nSteps?: number;
}

const FilterRangeSlider = ({
  leftKey,
  rightKey,
  min,
  max,
  unit,
  forwardTransform = (val) => val,
  inverseTransform = (val) => val,
  nSteps = 200,
}: FilterRangeSliderProps) => {
  const { setFieldValue, values } = useFormikContext<QueryForm>();
  const leftValue = getIn(values, leftKey);
  const rightValue = getIn(values, rightKey);
  const initialValues = [forwardTransform(leftValue), forwardTransform(rightValue)];
  const [value, setValue] = React.useState(initialValues);
  const minTrans = forwardTransform(min);
  const maxTrans = forwardTransform(max);
  const step = (maxTrans - minTrans) / nSteps;

  // Callbacks
  const onChange = useCallback((values: Array<number>) => {
    setValue(values);
  }, []);
  const onChangeEnd = useCallback((values: Array<number>) => {
    // Update the form values when the changes end
    const [l, r] = values;
    setFieldValue(leftKey, inverseTransform(l));
    setFieldValue(rightKey, inverseTransform(r));
  }, []);
  // Update slider value when form values change
  useEffect(() => {
    setValue([forwardTransform(leftValue), forwardTransform(rightValue)]);
  }, [leftValue, rightValue]);

  return (
    <VStack width="100%">
      <RangeSlider
        position="absolute"
        top={`${40 - 10}px`}
        aria-label={["min", "max"]}
        defaultValue={initialValues}
        min={minTrans}
        max={maxTrans}
        step={step}
        value={value}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        variant="filterForm"
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} boxSize={5} />
        <RangeSliderThumb index={1} boxSize={5} />
      </RangeSlider>
      <Flex pt="24px" alignItems="center" justifyContent="space-between" width="100%">
        <Text fontSize="sm">
          {toReadableNumber(inverseTransform(value[0]))}
          {unit}
        </Text>
        <Text fontSize="sm">
          {toReadableNumber(inverseTransform(value[1]))}
          {unit}
        </Text>
      </Flex>
    </VStack>
  );
};

export default memo(FilterRangeSlider);
