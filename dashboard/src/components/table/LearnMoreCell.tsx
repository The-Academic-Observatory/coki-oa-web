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

import { Link } from "@/components/common";
import { EntityProps, makeHref } from "@/components/table";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";
import React, { memo } from "react";

function LearnMoreCell({ entity }: EntityProps) {
  const href = makeHref(entity.entity_type, entity.id);
  return (
    <Link href={href} textDecorationColor="white !important">
      <Button variant="solid" size="xs" rightIcon={<ChevronRightIcon />}>
        <Text>Learn More</Text>
      </Button>
    </Link>
  );
}

export default memo(LearnMoreCell);
