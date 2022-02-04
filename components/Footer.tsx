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

import {
  Box,
  Flex,
  FlexProps,
  Stack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "./Link";
import Icon from "./Icon";
import React from "react";
import { LinkProps } from "./Layout";

import CurtinLogo from "../public/logo-curtin.svg";

const curtinLogoWidthDesktop = 245;
const curtinLogoWidthMobile = 210;
const iconSize: number = 48;

interface FooterProps extends FlexProps {
  links: Array<LinkProps>;
  sidebarWidth: number;
}

const Footer = ({ links, sidebarWidth, ...rest }: FooterProps) => {
  const padding = 10;

  return (
    <Flex {...rest}>
      {/*Left side of the footer that makes the sidebar look like part of the footer*/}
      <Box
        w={sidebarWidth}
        minWidth={sidebarWidth}
        bg="grey.400"
        display={{ base: "none", md: "block" }}
      >
        <Flex alignItems="center" justifyContent="center" h="full">
          <a href="https://www.curtin.edu.au/" target="_blank" rel="noreferrer">
            <Box
              minWidth={curtinLogoWidthDesktop}
              width={curtinLogoWidthDesktop}
            >
              <CurtinLogo />
            </Box>
          </a>
        </Flex>
      </Box>

      {/*base*/}
      <Flex
        flex={1}
        display={{ base: "flex", md: "none" }}
        bg="grey.300"
        borderTop="1px"
        borderColor="grey.500"
        p={padding}
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <FooterLinks links={links} />
          <FooterSocialMedia />
        </Flex>

        <Flex
          w="full"
          alignItems="center"
          justifyContent="space-between"
          pt={padding}
        >
          <FooterCredits />
          <a href="https://www.curtin.edu.au/" target="_blank" rel="noreferrer">
            <Box minWidth={curtinLogoWidthMobile} width={curtinLogoWidthMobile}>
              <CurtinLogo />
            </Box>
          </a>
        </Flex>
      </Flex>

      {/*md*/}
      <Flex
        flex={1}
        display={{
          base: "none",
          md: "flex",
          lg: "none",
          xl: "none",
          "2xl": "none",
        }}
        bg="grey.900"
        p="10"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <FooterLinks
          links={links}
          justifyContent="space-between"
          w="full"
          direction="row"
        />

        <Flex
          w="full"
          alignItems="center"
          justifyContent="space-between"
          pt={padding}
        >
          <FooterCredits />
          <FooterSocialMedia direction="row" />
        </Flex>
      </Flex>

      {/*lg*/}
      <Flex
        flex={1}
        display={{ base: "none", md: "none", lg: "flex" }}
        bg="grey.900"
        p="10"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <FooterCredits />
        <FooterLinks links={links} spacing={padding} direction="row" />
        <FooterSocialMedia direction="row" />
      </Flex>
    </Flex>
  );
};

interface FooterLinksProps extends StackProps {
  links: Array<LinkProps>;
}

const FooterLinks = ({ links, ...rest }: FooterLinksProps) => {
  return (
    <Stack
      color={{ base: "grey.900", md: "grey.100" }}
      textStyle="footerLink1"
      {...rest}
    >
      return (
      {links.map((l) => (
        <Link href={l.href} key={l.href}>
          {l.name}
        </Link>
      ))}
      )
    </Stack>
  );
};

const FooterCredits = ({ ...rest }: StackProps) => {
  return (
    <VStack
      align="left"
      textStyle="footerLink2"
      color={{ base: "grey.900", md: "grey.100" }}
      {...rest}
    >
      <Link href="https://clearbit.com/">Company Logos by Clearbit</Link>
    </VStack>
  );
};

const FooterSocialMedia = ({ ...rest }: StackProps) => {
  return (
    <Stack {...rest}>
      <Flex alignItems="center" justifyContent="center">
        <Text
          color={{ base: "grey.900", md: "grey.100" }}
          display={{ base: "none", xl: "block" }}
          textStyle="footerLink1"
        >
          Share
        </Text>
      </Flex>
      <a href="https://twitter.com/" target="_blank" rel="noreferrer">
        <Icon
          icon="twitter"
          size={iconSize}
          color={{ base: "grey.900", md: "grey.100" }}
        />
      </a>

      <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
        <Icon
          icon="linkedin"
          size={iconSize}
          color={{ base: "grey.900", md: "grey.100" }}
        />
      </a>

      <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
        <Icon
          icon="facebook"
          size={iconSize}
          color={{ base: "grey.900", md: "grey.100" }}
        />
      </a>
    </Stack>
  );
};

export default Footer;
