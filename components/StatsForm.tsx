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
// Author: Aniek Roelofs

import {
  Box,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Control, Controller } from "react-hook-form";
import { IFormInputs } from "./TableFilter";

function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

const stats: ["n_outputs" | "n_outputs_open" | "p_outputs_open", string][] = [
  ["n_outputs", "Total Publications"],
  ["n_outputs_open", "Open Publications"],
  ["p_outputs_open", "% Open Publications"],
];
export interface sliderValues {
  n_outputs: [number, number];
  n_outputs_open: [number, number];
  p_outputs_open: [number, number];
}
const StatsForm = (
  control: Control<IFormInputs>,
  sliderValues: sliderValues,
  setSliderValues: { (value: React.SetStateAction<sliderValues>): void },
  minMax: {
    min: { n_outputs: number; n_outputs_open: number; p_outputs_open: number };
    max: { n_outputs: number; n_outputs_open: number; p_outputs_open: number };
  },
  onSubmit: { (): void },
) => {
  return (
    <VStack align={"stretch"} divider={<StackDivider borderColor="grey.500" />}>
      {stats.map((statsType): ReactElement => {
        const sliderValue: number[] = sliderValues[statsType[0]];
        const handleChange = (e: number[]) => {
          const sliderValuesCopy = JSON.parse(JSON.stringify(sliderValues));
          setSliderValues(() => {
            return {
              ...sliderValuesCopy,
              [statsType[0]]: e,
            };
          });
        };
        const sliderMin: number = minMax.min[statsType[0]];
        const sliderMax: number = minMax.max[statsType[0]];

        return (
          <Controller
            key={statsType[0]}
            control={control}
            name={statsType[0]}
            // defaultValue={true}
            render={({ field: { onChange } }) => (
              <Box>
                <Box>
                  <Text textStyle="tableHeader">{statsType[1]}</Text>
                </Box>
                <RangeSlider
                  aria-label={["min", "max"]}
                  min={sliderMin}
                  max={sliderMax}
                  // defaultValue={sliderValue}
                  onChange={(changes) => {
                    handleChange(changes);
                    onChange(changes);
                  }}
                  onChangeEnd={() => {
                    onSubmit();
                  }}
                  value={sliderValue}
                  h={"85px"}
                  w={"90%"}
                  variant={"tableFilter"}
                >
                  <RangeSliderMark value={sliderMin} mt="50" ml="1" fontSize="sm">
                    {nFormatter(sliderMin, 1)}
                  </RangeSliderMark>
                  <RangeSliderMark value={sliderMax} mt="50" ml="0" fontSize="sm" textAlign={"start"}>
                    {nFormatter(sliderMax, 1)}
                  </RangeSliderMark>
                  <RangeSliderMark
                    value={sliderValue[0]}
                    width="50px"
                    mt="5px"
                    ml="-14px"
                    p="1px"
                    fontSize="sm"
                    textAlign="center"
                    bg="brand.500"
                    color={"white"}
                    rounded={"md"}
                  >
                    {nFormatter(sliderValue[0], 1)}
                  </RangeSliderMark>
                  <RangeSliderMark
                    value={sliderValue[1]}
                    width={"50px"}
                    mt="5px"
                    ml="-14px"
                    p="1px"
                    fontSize="sm"
                    textAlign="center"
                    bg="brand.500"
                    color={"white"}
                    rounded={"md"}
                  >
                    {nFormatter(sliderValue[1], 1)}
                  </RangeSliderMark>
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={5} />
                  <RangeSliderThumb index={1} boxSize={5} />
                </RangeSlider>
              </Box>
            )}
          />
        );
      })}
    </VStack>
  );
};

export default StatsForm;
