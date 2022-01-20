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
import Search from "./Search";

import React from "react";

interface NavbarProps extends FlexProps {
  isOpenSidebar: () => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  navbarHeightMobile: number;
}

const Navbar = ({
  isOpenSidebar,
  onOpenSidebar,
  onCloseSidebar,
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
        isRound
        size="lg"
        _focus={{
          boxShadow: "none",
        }}
        _active={{
          bg: "rgba(236, 236, 236, 0.3)",
          boxShadow: "none",
        }}
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

      <Image
        display={{ base: "none", md: "block" }}
        htmlWidth="56%"
        maxWidth="900px"
        position="absolute"
        top={0}
        right={0}
        zIndex={0}
        height={navbarHeightDesktop}
        objectPosition="right top"
        objectFit="cover"
        src="/coki-background.svg"
        alt="Curtin Logo"
      />

      <Search />

      <IconButton
        variant="clean"
        display={{ base: "flex", md: "none" }}
        aria-label="Search"
        isRound
        size="lg"
        _focus={{
          boxShadow: "none",
        }}
        _active={{
          bg: "rgba(236, 236, 236, 0.3)",
          boxShadow: "none",
        }}
        color="white"
        icon={<Icon icon="search" size={iconSize} />}
      />
    </Flex>
  );
};

export default Navbar;
