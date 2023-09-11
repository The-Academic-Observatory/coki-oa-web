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

interface ChartLegendProps extends BoxProps {
  labels: Array<string>;
  colors: Array<string>;
}

const ChartLegend = ({ labels, colors, ...rest }: ChartLegendProps) => {
  return (
    <Flex
      {...rest}
      flexWrap="wrap"
      w="full"
      justifyContent={{ base: "left", sm: "center" }}
      mt={{ base: "16px", md: 0 }}
      ml={{ base: "6px", md: 0 }}
    >
      {labels.map((label, i) => {
        const color = colors[i];
        return (
          <Flex key={label} layerStyle="chartKeyRow" mr="24px">
            <Box layerStyle="chartKeyBox" backgroundColor={color} />
            <Text textStyle="chartKeyHeader">{label}</Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default memo(ChartLegend);
