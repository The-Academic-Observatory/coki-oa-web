// Copyright 2024 Curtin University
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
// Author: Jamie Diprose

import { StackProps } from "@chakra-ui/layout/dist/stack/stack";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface BrandBadgeProps extends StackProps {
  name: string;
  imageSrc: string;
  isMultiLine?: boolean;
}

const BrandBadge = ({ name, imageSrc, isMultiLine, ...rest }: BrandBadgeProps) => {
  let sx = {};
  if (isMultiLine) {
    // Multi line with ellipsis
    sx = {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: "2",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
  } else {
    // Single line with ellipsis
    sx = {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };
  }

  return (
    <HStack {...rest}>
      <Box width="16px" height="16px" minWidth="16px">
        <Image rounded="full" objectFit="cover" boxSize="16px" src={imageSrc} alt={name} />
      </Box>

      <Text sx={sx}>{name}</Text>
    </HStack>
  );
};

export default memo(BrandBadge);
