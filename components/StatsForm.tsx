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
import { Controller } from "react-hook-form";

const stats = ["Total Publications", "Open Publications", "% Open Publications"];
const StatsForm = (control: any) => {
  return (
    <VStack align={"stretch"} divider={<StackDivider borderColor="grey.500" />}>
      {stats.map((statsType): ReactElement => {
        const [sliderValue, setSliderValue] = React.useState([0, 10]);

        return (
          <Controller
            key={statsType}
            control={control}
            name={statsType}
            defaultValue={false}
            render={({ field: { onChange, value, ref } }) => (
              <Box>
                <Box>
                  <Text textStyle="tableHeader">{statsType}</Text>
                </Box>
                <RangeSlider
                  aria-label={["min", "max"]}
                  defaultValue={[10, 30]}
                  onChange={setSliderValue}
                  //TODO make dynamic
                  h={"85px"}
                  variant={"tableFilter"}
                >
                  <RangeSliderMark // TODO define min and max values
                    value={0}
                    mt="5"
                    ml="-2.5"
                    fontSize="sm"
                  >
                    0
                  </RangeSliderMark>
                  <RangeSliderMark value={100} mt="5" ml="-2.5" fontSize="sm">
                    100
                  </RangeSliderMark>
                  {/*<RangeSliderMark*/}
                  {/*  value={sliderValue[0]}*/}
                  {/*  mt="5"*/}
                  {/*  ml="-2.5"*/}
                  {/*  fontSize="sm"*/}
                  {/*  textAlign="center"*/}
                  {/*  bg="brand.500"*/}
                  {/*  color={"white"}*/}
                  {/*>*/}
                  {/*  {sliderValue[0]}*/}
                  {/*</RangeSliderMark>*/}
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <Tooltip
                    hasArrow
                    label={sliderValue[0]}
                    bg="brand.500"
                    rounded={"md"}
                    color="white"
                    placement="top"
                    pl={2}
                    pr={2}
                    isOpen
                  >
                    <RangeSliderThumb index={0} boxSize={5} />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={sliderValue[1]}
                    bg="brand.500"
                    rounded={"md"}
                    color="white"
                    placement="top"
                    pl={2}
                    pr={2}
                    isOpen
                  >
                    <RangeSliderThumb index={1} boxSize={5} />
                  </Tooltip>
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
