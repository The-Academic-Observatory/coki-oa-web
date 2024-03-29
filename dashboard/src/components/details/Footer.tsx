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
import { EntityDetailsProps } from "@/components/details";
import { Button, Flex, Text } from "@chakra-ui/react";
import React, { memo } from "react";

const Footer = ({ entity, stats }: EntityDetailsProps) => {
  return (
    <Flex
      w="full"
      alignItems="center"
      flexDirection={{ base: "column", sm: "row" }}
      justifyContent="space-between"
      py="12px"
    >
      <Link href={`/${entity.entity_type}/`}>
        <Button variant="solid" size="lg">
          Return to Dashboard
        </Button>
      </Link>
      <Text textStyle="lastUpdated" pt={{ base: "16px", sm: 0 }}>
        Data updated {stats.last_updated}
      </Text>
    </Flex>
  );
};

export default memo(Footer);
