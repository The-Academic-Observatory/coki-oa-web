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

import React, { ReactNode, useEffect } from "react";
import {
  Box,
  Drawer,
  DrawerContent,
  Flex,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import Breadcrumb from "./Breadcrumb";

import Footer from "./Footer";
import SidebarContent from "./SidebarContent";
import Navbar from "./Navbar";
import { SearchDrawer } from "./Search";
import Fuse from "fuse.js";

export interface LinkProps {
  name: string;
  icon: string;
  href: string;
}

const links: Array<LinkProps> = [
  { name: "Open Access Dashboard", icon: "dashboard", href: "/" },
  { name: "Open Access", icon: "open", href: "/open" },
  { name: "How it Works", icon: "how", href: "/how" },
  { name: "Data", icon: "data", href: "/data" },
  { name: "About", icon: "about", href: "/about" },
  { name: "Contact", icon: "contact", href: "/contact" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const {
    isOpen: isOpenSidebar,
    onOpen: onOpenSidebar,
    onClose: onCloseSidebar,
  } = useDisclosure();
  const {
    isOpen: isOpenSearch,
    onOpen: onOpenSearch,
    onClose: onCloseSearch,
  } = useDisclosure();

  const navbarHeightMobile: number = 68;
  const sidebarWidth: number = 340;

  const [fuse, setFuse] = React.useState(null);

  // Load and index data
  useEffect(() => {
    fetch("/autocomplete.json")
      .then((res) => res.json())
      .then((data) => {
        // Setup fuse after data loaded
        const options = {
          includeScore: true,
          threshold: 0.1,
          keys: ["name"],
        };
        const fuse = new Fuse(data, options);
        setFuse(fuse);
      });
  }, []);

  return (
    <Flex flexDirection="column" minH="100vh">
      <Image
        display={{ base: "none", md: "block" }}
        htmlWidth="56%"
        maxWidth="900px"
        position="absolute"
        top={0}
        right={0}
        objectPosition="right top"
        objectFit="cover"
        src="/coki-background.svg"
        alt="Curtin Logo"
      />
      <SearchDrawer
        fuse={fuse}
        isOpen={isOpenSearch}
        onOpen={onOpenSearch}
        onClose={onCloseSearch}
        navbarHeightMobile={navbarHeightMobile}
      />
      <Box p={0}>
        <Navbar
          fuse={fuse}
          isOpenSidebar={isOpenSidebar}
          onOpenSidebar={onOpenSidebar}
          onCloseSidebar={onCloseSidebar}
          isOpenSearch={isOpenSearch}
          onOpenSearch={onOpenSearch}
          onCloseSearch={onCloseSearch}
          navbarHeightMobile={navbarHeightMobile}
        />

        <Drawer
          autoFocus={false}
          isOpen={isOpenSidebar}
          placement="left"
          onClose={onCloseSidebar}
          returnFocusOnClose={false}
          onOverlayClick={onCloseSidebar}
          preserveScrollBarGap={true}
          size="full"
        >
          {/* pointerEvents="none" stops the drawer from blocking pointer events from the close button */}
          <DrawerContent bg="none" pointerEvents="none" boxShadow="none">
            <SidebarContent
              links={links}
              navbarHeightMobile={navbarHeightMobile}
              sidebarWidth={sidebarWidth}
              onClose={onCloseSidebar}
            />
          </DrawerContent>
        </Drawer>
      </Box>

      <Flex flex={1}>
        <Box
          w={sidebarWidth}
          bg="grey.400"
          display={{ base: "none", md: "block" }}
        >
          <SidebarContent
            links={links}
            navbarHeightMobile={navbarHeightMobile}
            sidebarWidth={sidebarWidth}
            w={sidebarWidth}
            onClose={() => onCloseSidebar}
            display={{ base: "none", md: "block" }}
          />
        </Box>
        <Box flex={1} bg="grey.200">
          <Flex flexDirection="column">
            <Box
              flex={1}
              px={{ base: 0, md: "40px" }}
              pt={{ base: 0, md: "50px" }}
              pb={{ base: 0, md: "90px" }}
            >
              <Box
                display={{ base: "none", md: "block" }}
                pb="32px"
                textStyle="breadcrumb"
              >
                <Breadcrumb labelsToUppercase />
              </Box>

              {/* position="relative" is required to keep the COKI background image behind the children as
                  z-index only works on positioned elements*/}
              <Box position="relative">{children}</Box>
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Footer links={links} sidebarWidth={sidebarWidth} />
    </Flex>
  );
}
