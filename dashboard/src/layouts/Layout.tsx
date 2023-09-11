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
import { Box, Drawer, DrawerContent, Flex, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { RemoveScroll } from "react-remove-scroll";
import { SidebarContent, Navbar, Footer } from "@/layouts";
import { SearchMobile } from "@/components/search";
import COKIBackground from "@root/public/coki-background.svg";

export interface LinkProps {
  name: string;
  icon: string;
  href: string;
}

const links: Array<LinkProps> = [
  { name: "Open Access Dashboard", icon: "dashboard", href: "/" },
  { name: "Open Access", icon: "open", href: "/open/" },
  { name: "How it Works", icon: "how", href: "/how/" },
  { name: "Data", icon: "data", href: "/data/" },
  { name: "About", icon: "about", href: "/about/" },
  { name: "Contact", icon: "contact", href: "/contact/" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const { isOpen: isOpenSidebar, onOpen: onOpenSidebar, onClose: onCloseSidebar } = useDisclosure();
  const { isOpen: isOpenSearch, onOpen: onOpenSearch, onClose: onCloseSearch } = useDisclosure();

  const [isStd] = useMediaQuery("(min-width: 1310px)");
  useEffect(() => {
    if (isStd) {
      onCloseSidebar();
    }
  }, [isStd]);

  const navbarHeightMobile: number = 68;
  const sidebarWidth: number = 310;

  return (
    <Flex flexDirection="column" minH="100vh">
      <Box display={{ base: "none", std: "block" }}>
        <COKIBackground
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            maxWidth: "900px",
            width: "56%",
          }}
        />
      </Box>

      <SearchMobile
        isOpen={isOpenSearch}
        onOpen={onOpenSearch}
        onClose={onCloseSearch}
        navbarHeightMobile={navbarHeightMobile}
      />
      <Box p={0}>
        <Navbar
          isOpenSidebar={isOpenSidebar}
          onOpenSidebar={onOpenSidebar}
          onCloseSidebar={onCloseSidebar}
          isOpenSearch={isOpenSearch}
          onOpenSearch={onOpenSearch}
          onCloseSearch={onCloseSearch}
          navbarHeightMobile={navbarHeightMobile}
        />

        <RemoveScroll enabled={isOpenSidebar}>
          <Drawer
            autoFocus={true}
            trapFocus={true}
            isOpen={isOpenSidebar}
            placement="left"
            onClose={onCloseSidebar}
            returnFocusOnClose={false}
            onOverlayClick={onCloseSidebar}
            preserveScrollBarGap={true}
            size="full"
          >
            {/* pointerEvents="none" stops the drawer from blocking pointer events from the close button */}
            <DrawerContent
              bg="white"
              top={`${navbarHeightMobile}px !important`}
              pointerEvents="none"
              boxShadow="none"
              display={{ base: "flex", std: "none" }}
            >
              <SidebarContent
                id="sidebar-mobile"
                links={links}
                navbarHeightMobile={navbarHeightMobile}
                onClose={onCloseSidebar}
              />
            </DrawerContent>
          </Drawer>
        </RemoveScroll>
      </Box>

      <Flex flex={1}>
        <Box minWidth={sidebarWidth} bg="grey.400" display={{ base: "none", std: "block" }}>
          <SidebarContent
            id="sidebar"
            links={links}
            navbarHeightMobile={navbarHeightMobile}
            onClose={() => onCloseSidebar}
            display={{ base: "none", std: "block" }}
          />
        </Box>
        <Box flex={1} bg={{ base: "white", md: "grey.200" }}>
          {/* position="relative" is required to keep the COKI background image behind the children as
                  z-index only works on positioned elements*/}
          <Box position="relative">{children}</Box>
        </Box>
      </Flex>

      <Footer links={links} sidebarWidth={sidebarWidth} />
    </Flex>
  );
};

export default Layout;
