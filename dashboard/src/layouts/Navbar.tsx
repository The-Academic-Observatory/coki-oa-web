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

import { Icon, Link } from "@/components/common";
import { SearchDesktop } from "@/components/search";
import { Box, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import COKILogoWhite from "@root/public/logo-white.svg";
import COKILogo from "@root/public/logo.svg";
import React, { memo } from "react";

interface NavbarProps extends FlexProps {
  isOpenSidebar: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  isOpenSearch: boolean;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  navbarHeightMobile: number;
}

const Navbar = ({
  isOpenSidebar,
  onOpenSidebar,
  onCloseSidebar,
  isOpenSearch,
  onOpenSearch,
  onCloseSearch,
  navbarHeightMobile,
  ...rest
}: NavbarProps) => {
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
        variant="icon"
        data-test="menu"
        aria-label="Menu"
        onClick={() => {
          // Force scrolling to top as we should be at top of page when drawer is open
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          if (!isOpenSidebar) {
            onOpenSidebar();
          } else {
            onCloseSidebar();
          }
        }}
        icon={isOpenSidebar ? <Icon icon="cross" size={iconSize} /> : <Icon icon="burger" size={iconSize} />}
        display={{ base: "flex", std: "none" }}
        color="grey.100"
      />

      <Link href="/">
        {/* Safari on iOS can cut the bottom of the logo off if the dimensions are not exact */}
        <Box display={{ base: "none", std: "block" }}>
          <COKILogo width="270px" height="50px" />
        </Box>

        {/* Safari on iOS can cut the bottom of the logo off if the dimensions are not exact */}
        <Box display={{ base: "block", std: "none" }}>
          <COKILogoWhite width="147px" height="27px" />
        </Box>
      </Link>

      <SearchDesktop display={{ base: "none", std: "block" }} />

      <IconButton
        variant="icon"
        display={{ base: "flex", std: "none" }}
        data-test="search"
        aria-label="Search"
        isRound
        color="white"
        onClick={() => {
          // Force scrolling to top as we should be at top of page when drawer is open
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          if (!isOpenSearch) {
            onOpenSearch();
          } else {
            onCloseSearch();
          }
        }}
        icon={
          <Box position="relative">
            <Icon
              icon="search"
              size={iconSize}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              opacity={isOpenSearch ? 0 : 1}
            />
            <Icon
              icon="cross"
              size={iconSize}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              opacity={isOpenSearch ? 1 : 0}
            />
          </Box>
        }
      />
    </Flex>
  );
};

export default memo(Navbar);
