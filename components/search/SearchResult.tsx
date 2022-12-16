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

import { Box, BoxProps, HStack, Image, Text } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import Link from "../common/Link";
import React, { memo } from "react";
import { cokiImageLoader } from "../../lib/api";

interface SearchResultProps extends BoxProps {
  entity: Entity;
  onClick: () => void;
}

const SearchResult = ({ entity, onClick, ...rest }: SearchResultProps) => {
  return (
    <Box key={entity.id} data-test={entity.id}>
      <Link href={`/${entity.entity_type}/${entity.id}`} onClick={onClick}>
        <HStack my="16px">
          <Image
            rounded="full"
            objectFit="cover"
            boxSize="16px"
            src={cokiImageLoader(entity.logo_sm)}
            alt={entity.name}
          />
          <Text textStyle="tableCell">{entity.name}</Text>
        </HStack>
      </Link>
    </Box>
  );
};

export default memo(SearchResult);
