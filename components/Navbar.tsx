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

import { Flex, FlexProps, IconButton, Image } from "@chakra-ui/react";
import Icon from "./Icon";
import Link from "./Link";
import { Search } from "./Search";

import React from "react";
import Fuse from "fuse.js";

interface NavbarProps extends FlexProps {
  fuse: Fuse<any>;
  isOpenSidebar: () => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  isOpenSearch: () => void;
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
      px={{ base: navbarLrPaddingMobile, md: navbarLrPaddingDesktop }}
      height={{ base: navbarHeightMobile, md: navbarHeightDesktop }}
      alignItems="center"
      bg={{ base: "grey.900", md: "grey.100" }}
      justifyContent="space-between"
    >
      <IconButton
        variant="clean"
        aria-label="Open menu"
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
        display={{ base: "flex", md: "none" }}
        color="grey.100"
      />

      <Link href="/">
        <Image
          htmlWidth={cokiLogoWidthDesktop}
          src="/logo.svg"
          alt="COKI Logo"
          display={{ base: "none", md: "block" }}
        />

        <Image
          htmlWidth={cokiLogoWidthMobile}
          src="/logo-white.svg"
          alt="COKI Logo"
          display={{ base: "block", md: "none" }}
        />
      </Link>

      <Search fuse={fuse} display={{ base: "none", md: "block" }} />

      <IconButton
        variant="clean"
        display={{ base: "flex", md: "none" }}
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
