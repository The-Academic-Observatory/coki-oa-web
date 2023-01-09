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

import Link from "../common/Link";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import React, { memo } from "react";
import { EntityProps, makeHref } from "./IndexTable";

function EntityCell({ entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <HStack>
        <Box width="16px" height="16px" minWidth="16px">
          <Image rounded="full" objectFit="cover" boxSize="16px" src={entity.logo_s} />
        </Box>
        <Text size={{ base: "m", smm: "s" }}>{entity.name}</Text>
      </HStack>
    </Link>
  );
}

export default memo(EntityCell);
