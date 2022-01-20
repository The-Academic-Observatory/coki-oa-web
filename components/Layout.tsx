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

import React, { ReactNode } from "react";
import {
  Box,
  Drawer,
  DrawerContent,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Breadcrumb from "./Breadcrumb";
// import elasticlunr from 'elasticlunr'
import Footer from "./Footer";
import SidebarContent from "./SidebarContent";
import Navbar from "./Navbar";

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

//
// function fetchAutocomplete(){
//     const [cats, setCats] = useState()
//     useEffect(() => {
//         fetch('http://localhost:3000/')
//             .then(response => response.json())
//             .then(_cats => setCats(_cats));
//     }, [])
//
//     return cats
// }

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

  // Setup autocomplete
  // const autocomplete = fetchAutocomplete()
  // const searchIndex = elasticlunr(function () {
  //     this.addField('name');
  //     this.setRef('index');
  //     this.saveDocument(false);
  // })
  // autocomplete.forEach((item) => {
  //     searchIndex.addDoc(item);
  // })

  // Fetch data and add index field
  // const csvString = (await axios.get("/data/autocomplete.txt")).data;
  // this.data = this.parseCsv(csvString);
  // // Build search index
  // let searchIndex = elasticlunr(function () {
  //     this.addField('name');
  //     this.setRef('index');
  //     this.saveDocument(false);
  // });
  // this.data.forEach((item) => {
  //     searchIndex.addDoc(item);
  // });
  // this.searchIndex = searchIndex;

  return (
    <Flex flexDirection="column" minH="100vh">
      <Box p={0}>
        <Navbar
          isOpenSidebar={isOpenSidebar}
          onOpenSidebar={onOpenSidebar}
          onCloseSidebar={onCloseSidebar}
          navbarHeightMobile={navbarHeightMobile}
        />
        {/*onSearchOpen={onOpenSearch}*/}
        <Drawer
          autoFocus={false}
          isOpen={isOpenSidebar}
          placement="left"
          onClose={onCloseSidebar}
          returnFocusOnClose={false}
          onOverlayClick={onCloseSidebar}
          size="full"
        >
          {/* pointerEvents="none" stops the drawer from blocking pointer events from the close button */}
          <DrawerContent bg="none" pointerEvents="none">
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
              <Breadcrumb
                display={{ base: "none", md: "block" }}
                labelsToUppercase
                pb="32px"
                textStyle="breadcrumb"
              />
              <Text wrap="nowrap">{children}</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Footer links={links} sidebarWidth={sidebarWidth} />
    </Flex>
  );
}
