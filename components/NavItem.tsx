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

import { Flex, FlexProps, Text, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "./Link";
import styles from "./Layout.module.css";
import Icon from "./Icon";
import React from "react";
import SidebarContent from "./SidebarContent";

interface NavItemProps extends FlexProps {
  icon: string;
  href: string;
  text: string;
  sidebarWidth: number;
}

function isActive(path: string, href: string) {
  return (
    path === href ||
    (href === "/" &&
      (path.startsWith("/country") || path.startsWith("/institution")))
  );
}

const NavItem = ({ icon, href, text, sidebarWidth, ...rest }: NavItemProps) => {
  const iconSize = 32;
  const borderRight = 5;
  const sidebarPaddingLeft = 32 / 4;
  // const hover = useBreakpointValue({
  //   base: {
  //     bg: "grey.500",
  //   },
  //   md: {
  //     bg: "brand.500",
  //     color: "grey.100",
  //     borderRight: borderRight,
  //     borderColor: "brand.300",
  //     borderStyle: "solid",
  //   },
  // });
  // const style = useBreakpointValue({
  //   base: {
  //     borderBottom: "1px",
  //     borderColor: "#EBEBEB",
  //     borderStyle: "solid",
  //   },
  //   md: {},
  // });
  const { asPath } = useRouter();

  return (
    <Link href={href} role="group" style={{ textDecoration: "none" }} {...rest}>
      <Flex
        align="center"
        width={{ base: "full", md: sidebarWidth }}
        height={{ base: "96px", md: "72px" }}
        cursor="pointer"
        pl={sidebarPaddingLeft}
        // style={style}
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
        <Icon mr={{ base: "24px", md: "12px" }} icon={icon} size={iconSize} />
        <Text textStyle="menuItem">{text}</Text>
      </Flex>
    </Link>
  );
};

export default NavItem;
