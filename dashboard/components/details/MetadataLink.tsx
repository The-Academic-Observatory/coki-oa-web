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

import { Flex, LinkProps, Text } from "@chakra-ui/react";
import Link from "../common/Link";
import Icon from "../common/Icon";
import React, { memo } from "react";

interface MetadataLinkProps extends LinkProps {
  icon: string;
  name?: string;
  href?: string;
}

const MetadataLink = ({ icon, name, href, ...rest }: MetadataLinkProps) => {
  if (href === undefined) {
    href = "https://open.coki.ac";
  }

  return (
    <Link href={href} {...rest}>
      <Flex data-test={`metadata-link-${name}`} align="center" role="group" cursor="pointer">
        <Icon mr="2" icon={icon} size={32} color="#101820" />
        <Text textStyle="entityIconLink">{name}</Text>
      </Flex>
    </Link>
  );
};

export default memo(MetadataLink);
