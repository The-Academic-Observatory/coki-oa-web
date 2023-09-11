// Copyright 2023 Curtin University
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

import React, { LegacyRef, memo } from "react";
import { Box, BoxProps, HStack, Skeleton, SkeletonCircle } from "@chakra-ui/react";

interface SkeletonSearchResultProps extends BoxProps {
  lastEntityRef: LegacyRef<HTMLDivElement>;
}

const SkeletonSearchResult = ({ lastEntityRef, ...rest }: SkeletonSearchResultProps) => {
  return (
    <Box ref={lastEntityRef} {...rest}>
      <HStack my="16px">
        <SkeletonCircle size="16px" />
        <Skeleton height="16px" flex="1" />
      </HStack>
    </Box>
  );
};

export default memo(SkeletonSearchResult);
