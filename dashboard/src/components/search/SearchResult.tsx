// Copyright 2022-2024 Curtin University
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

import { BrandBadge, Link } from "@/components/common";
import { cokiImageLoader } from "@/lib/api";
import { Entity } from "@/lib/model";
import { Box, BoxProps, HStack, Image, Text } from "@chakra-ui/react";
import React, { memo } from "react";

interface SearchResultProps extends BoxProps {
  entity: Entity;
  onClick: () => void;
}

const SearchResult = ({ entity, onClick, ...rest }: SearchResultProps) => {
  return (
    <Box key={entity.id} textStyle="tableCell" data-test={entity.id} {...rest}>
      <Link href={`/${entity.entity_type}/${entity.id}`} onClick={onClick}>
        <BrandBadge name={entity.name} imageSrc={cokiImageLoader(entity.logo_sm)} my="16px" />
      </Link>
    </Box>
  );
};

export default memo(SearchResult);
