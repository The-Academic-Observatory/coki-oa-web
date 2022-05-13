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
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Control, Controller } from "react-hook-form";
import { IFormInputs } from "./TableFilter";

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
                  // defaultValue={sliderValue}
                  onChange={(changes) => {
                    handleChange(changes);
                    onChange(changes);
                  }}
                  onChangeEnd={() => {
                    onSubmit();
                  }}
                  value={sliderValue}
                  //TODO make dynamic
                  h={"85px"}
                  w={"95%"}
                  variant={"tableFilter"}
                >
                  <RangeSliderMark // TODO define min and max values
                    value={0}
                    mt="50"
                    ml="1"
                    fontSize="sm"
                  >
                    0
                  </RangeSliderMark>
                  <RangeSliderMark value={100} mt="50" ml="0" fontSize="sm" textAlign={"start"}>
                    100
                  </RangeSliderMark>
                  <RangeSliderMark
                    value={sliderValue[0]}
                    mt="5px"
                    ml="-4px"
                    p="1px"
                    w="7"
                    fontSize="sm"
                    textAlign="center"
                    bg="brand.500"
                    color={"white"}
                    rounded={"md"}
                  >
                    {sliderValue[0]}
                  </RangeSliderMark>
                  <RangeSliderMark
                    value={sliderValue[1]}
                    mt="5px"
                    ml="-4px"
                    p="1px"
                    w="7"
                    fontSize="sm"
                    textAlign="center"
                    bg="brand.500"
                    color={"white"}
                    rounded={"md"}
                  >
                    {sliderValue[1]}
                  </RangeSliderMark>
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} boxSize={5} />
                  {/*<Tooltip*/}
                  {/*  hasArrow*/}
                  {/*  label={sliderValue[1]}*/}
                  {/*  bg="brand.500"*/}
                  {/*  rounded={"md"}*/}
                  {/*  color="white"*/}
                  {/*  placement="top"*/}
                  {/*  pl={2}*/}
                  {/*  pr={2}*/}
                  {/*  isOpen*/}
                  {/*>*/}
                  <RangeSliderThumb index={1} boxSize={5} />
                  {/*</Tooltip>*/}
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
