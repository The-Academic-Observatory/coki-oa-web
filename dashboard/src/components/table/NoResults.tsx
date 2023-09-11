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

import React, { memo } from "react";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";

interface NoResultsProps {
  onResetQueryForm: () => void;
}

const NoResults = ({ onResetQueryForm }: NoResultsProps) => {
  return (
    <Flex
      position="absolute"
      background="linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6937149859943977) 65%, rgba(255,255,255,0) 100%)"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={1}
      alignItems="center"
      justifyContent="center"
    >
      <VStack>
        <Text as="p" fontSize="32px">
          No results
        </Text>
        <Text mt="0 !important" pb="32px" fontSize="24px">
          Try to change your filters
        </Text>
        <Button variant="solid" size="md" onClick={onResetQueryForm}>
          Reset Filters
        </Button>
      </VStack>
    </Flex>
  );
};

export default memo(NoResults);
