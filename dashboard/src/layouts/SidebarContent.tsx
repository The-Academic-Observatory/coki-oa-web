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

import Link from "@/components/common/Link";
import { LinkProps, NavItem } from "@/layouts";
import { Box, BoxProps, Button } from "@chakra-ui/react";
import React, { memo } from "react";
import { FaHeart } from "react-icons/fa";

interface SidebarProps extends BoxProps {
  links: Array<LinkProps>;
  onClose: () => void;
  navbarHeightMobile: number;
}

const SidebarContent = ({ links, onClose, navbarHeightMobile, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={{ base: "grey.100", std: "grey.400" }}
      position={{ base: "absolute", std: "relative" }}
      w="full"
      pt={{ base: 0, std: 90 }}
      align="center"
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
          pointerEvents="auto"
          onClick={() => onClose()}
        />
      ))}

      <Link href="https://give.curtin.edu.au/make-a-gift?fund=582" target="_blank" pointerEvents="auto">
        <Button
          mt="3rem"
          leftIcon={<FaHeart />}
          colorScheme="brand"
          width="130px"
          height="45px"
          fontSize="1rem"
          textTransform="uppercase"
          variant="outline"
        >
          Sponsor
        </Button>
      </Link>
    </Box>
  );
};

export default memo(SidebarContent);
