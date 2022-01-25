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

import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";
import NavItem from "./NavItem";
import { LinkProps } from "./Layout";

interface SidebarProps extends BoxProps {
  links: Array<LinkProps>;
  onClose: () => void;
  navbarHeightMobile: number;
  sidebarWidth: number;
}

const SidebarContent = ({
  links,
  onClose,
  navbarHeightMobile,
  sidebarWidth,
  ...rest
}: SidebarProps) => {
  const paddingTop = 90;
  return (
    <Box
      bg={{ base: "grey.100", md: "grey.400" }}
      position={{ base: "absolute", md: "relative" }}
      top={{ base: navbarHeightMobile, md: 0 }}
      w={{ base: "full", md: 80 }}
      pt={{ base: 0, md: paddingTop }}
      {...rest}
    >
      {links.map((link) => (
        // pointerEvents="auto" enables the NavItem to receive mouse events
        // onClose closes the Sidebar
        <NavItem
          key={link.name}
          icon={link.icon}
          href={link.href}
          text={link.name}
          sidebarWidth={sidebarWidth}
          pointerEvents="auto"
          onClick={() => onClose()}
        />
      ))}
    </Box>
  );
};

export default SidebarContent;
