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

import { Box, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import Icon from "./Icon";
import Link from "./Link";
import { Search } from "./Search";
import COKILogo from "../public/logo.svg";
import COKILogoWhite from "../public/logo-white.svg";
import React from "react";
import Fuse from "fuse.js";

interface NavbarProps extends FlexProps {
  fuse: Fuse<any> | null;
  isOpenSidebar: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  isOpenSearch: boolean;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  navbarHeightMobile: number;
}

const Navbar = ({
  fuse,
  isOpenSidebar,
  onOpenSidebar,
  onCloseSidebar,
  isOpenSearch,
  onOpenSearch,
  onCloseSearch,
  navbarHeightMobile,
  ...rest
}: NavbarProps) => {
  const cokiLogoWidthMobile = 146;
  const cokiLogoWidthDesktop = 269;
  const navbarHeightDesktop: number = 136;
  const navbarLrPaddingMobile = 22;
  const navbarLrPaddingDesktop = 40 / 4;
  const iconSize = 24;

  return (
    <Flex
      px={{ base: navbarLrPaddingMobile, std: navbarLrPaddingDesktop }}
      height={{ base: navbarHeightMobile, std: navbarHeightDesktop }}
      alignItems="center"
      bg={{ base: "grey.900", std: "grey.100" }}
      justifyContent="space-between"
    >
      <IconButton
        variant="clean"
        data-test="menu"
        aria-label="Menu"
        onClick={() => {
          if (!isOpenSidebar) {
            onOpenSidebar();
          } else {
            onCloseSidebar();
          }
        }}
        icon={
          isOpenSidebar ? (
            <Icon icon="cross" size={iconSize} />
          ) : (
            <Icon icon="burger" size={iconSize} />
          )
        }
        display={{ base: "flex", std: "none" }}
        color="grey.100"
      />

      <Link href="/">
        <Box
          minWidth={cokiLogoWidthDesktop}
          width={cokiLogoWidthDesktop}
          display={{ base: "none", std: "block" }}
        >
          <COKILogo />
        </Box>

        <Box
          minWidth={cokiLogoWidthMobile}
          width={cokiLogoWidthMobile}
          display={{ base: "block", std: "none" }}
        >
          <COKILogoWhite />
        </Box>
      </Link>

      <Search fuse={fuse} display={{ base: "none", std: "block" }} />

      <IconButton
        variant="clean"
        display={{ base: "flex", std: "none" }}
        data-test="search"
        aria-label="Search"
        isRound
        color="white"
        onClick={() => {
          if (!isOpenSearch) {
            onOpenSearch();
          } else {
            onCloseSearch();
          }
        }}
        icon={
          isOpenSearch ? (
            <Icon icon="cross" size={iconSize} />
          ) : (
            <Icon icon="search" size={iconSize} />
          )
        }
      />
    </Flex>
  );
};

export default Navbar;
