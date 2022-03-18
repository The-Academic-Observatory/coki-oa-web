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
import { useRouter } from "next/router";
import Link from "./Link";
import styles from "./Layout.module.css";
import Icon from "./Icon";
import React from "react";

interface NavItemProps extends BoxProps {
  icon: string;
  href: string;
  text: string;
}

function isActive(path: string, href: string) {
  return (
    path === href ||
    (path === "//" && href == "/") ||
    (href === "/" &&
      (path.startsWith("/country") || path.startsWith("/institution")))
  );
}

const NavItem = ({ icon, href, text, ...rest }: NavItemProps) => {
  const iconSize = 32;
  const borderRight = 5;
  const { asPath } = useRouter();

  return (
    <Box {...rest}>
      <Link href={href} role="group" style={{ textDecoration: "none" }}>
        <Flex
          align="center"
          height="72px"
          cursor="pointer"
          px={{ base: "24px", md: "32px" }}
          className={isActive(asPath, href) ? styles.active : ""}
          _hover={{
            bg: "brand.500",
            color: "grey.100",
            borderRight: borderRight,
            borderColor: "brand.300",
            borderStyle: "solid",
          }}
          {...rest}
        >
          <Icon mr="12px" icon={icon} size={iconSize} />
          <Text textStyle="menuItem">{text}</Text>
        </Flex>
      </Link>
    </Box>
  );
};

export default NavItem;
