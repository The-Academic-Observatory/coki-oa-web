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
// Author: Alex Massen-Hane

import { useToast, Button, Portal, Text, Center, VStack, Flex, FlexProps, Box } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import MetadataLinkShare from "./MetadataLinkShare";
import React, { memo } from "react";
import { useClipboard } from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from "@chakra-ui/react";
import { FiShare2, FiLink2 } from "react-icons/fi";
import { Entity } from "../../lib/model";

interface SharebuttonLinksProps extends FlexProps {
  entity: Entity;
  category: string;
  platform: string;
  id: string;
  hrefCoki: string;
  iconTw: string;
  iconFb: string;
  iconLi: string;
}

// Needs to have the info on if it's region or institution for the tweet.
const SharebuttonLinks = ({
  entity,
  category,
  platform,
  id,
  hrefCoki,
  iconTw,
  iconFb,
  iconLi,
  ...rest
}: SharebuttonLinksProps) => {
  var shareText = encodeURIComponent("Open Access Research Performance for " + `${entity.name}` + "\n");

  // TODO Somehow remove the domain name being hardcoded

  if (hrefCoki === undefined) {
    hrefCoki = "https://open.coki.ac";
  } else {
    hrefCoki = "https://open.coki.ac" + hrefCoki.slice(0, -1);
  }

  // Share page urls for each social site
  const hrefTw = "https://twitter.com/intent/tweet?text=" + shareText + "&url=" + hrefCoki;
  const hrefFb = "https://www.facebook.com/sharer/sharer.php?u=" + hrefCoki;
  const hrefLi = "https://www.linkedin.com/shareArticle?mini=true&url=" + hrefCoki;

  // Copy link button hook
  const { onCopy, hasCopied } = useClipboard(hrefCoki);

  return (
    <Popover variant="shareButton">
      <PopoverTrigger>
        <Flex data-test="popover-trigger-div">
          {/* If on desktop, display as a link like the Downlad and Wikipedia links */}
          <Flex display={{ base: "none", sm: "none", md: "flex" }} cursor="pointer">
            <Button variant="shareButtonDesktop" data-test="desktop-popover-share-button">
              <Flex mr="2">
                <FiShare2 size={28} color={"#101820"} />
              </Flex>
              <Text textStyle="entityIconLink" _hover={{ textDecoration: "underline" }} color="black">
                Share
              </Text>
            </Button>
          </Flex>

          {/* If on mobile, display as button*/}
          <Flex
            display={{ base: "flex", sm: "flex", md: "none" }}
            paddingRight={{ base: "10px", sm: "10px", md: "0px" }}
          >
            <Button variant="shareButton" data-test="mobile-popover-share-button">
              <Flex paddingRight={{ base: "0px", sm: "10px", md: "10px" }} align="center">
                <FiShare2 size={24} />
              </Flex>
              <Text display={{ base: "none", sm: "flex", md: "none" }} casing="uppercase">
                Share
              </Text>
            </Button>
          </Flex>
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent data-test={`${platform}-share-popover-panel`}>
          <PopoverArrow />
          <PopoverBody>
            <Grid templateRows="repeat(3)" templateColumns="repeat(2, 1fr)" alignItems="center" gap={{ base: "8px" }}>
              <GridItem>
                <VStack spacing="auto" align="center">
                  <Button
                    id="copy-link-button"
                    onClick={onCopy}
                    size="min"
                    _focus={{ border: "none" }}
                    bgColor="white"
                    _hover={{ bgColor: "none" }}
                  >
                    {hasCopied ? <CopyLink hrefLink={hrefCoki} /> : <FiLink2 size={32} />}
                  </Button>
                  <Text fontSize="14px">Link</Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack spacing="auto">
                  <MetadataLinkShare icon={iconTw} href={hrefTw} />
                  <Text fontSize="14px">Twitter </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack spacing="auto">
                  <MetadataLinkShare icon={iconFb} href={hrefFb} />
                  <Text fontSize="14px">Facebook</Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack spacing="auto">
                  <MetadataLinkShare icon={iconLi} href={hrefLi} />
                  <Text fontSize="14px">LinkedIn</Text>
                </VStack>
              </GridItem>
              {/* 
              Commenting this embed icon out as it doesn't have a function yet.
              <GridItem colSpan={2} padding="4px">
                <VStack spacing="auto">
                  <MetadataLinkShare icon="code" />
                  <Text fontSize="14px">Embed</Text>
                </VStack>
              </GridItem> */}
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

// Copy link button toast

// The useEffect stops the toast popup from appearing multiple times.
// TODO: figure out why hrefLink is being brought in as an Object, not just a string.
const CopyLink = (hrefLink: Object) => {
  const toast = useToast();
  React.useEffect(() => {
    toast({
      title: "Copied!",
      duration: 2000,
      isClosable: false,
      position: "top",
      // To change the colour of the toast to the brand colour.
      render: () => (
        <Center marginTop={{ base: "76px", sm: "76px", md: "81px", std: "0px" }}>
          <Box
            color="white"
            borderRadius="5px"
            m={3}
            p={3}
            bgColor="brand.500"
            style={{
              filter: "drop-shadow( 0px 0px 20px rgba(0, 0, 0, 0.2))",
            }}
          >
            <Flex flexDirection="column" alignItems="center">
              <Text
                alignItems="center"
                fontSize="18px"
                fontWeight="700"
                display={{ base: "none", sm: "none", md: "flex" }}
              >
                Copied link: {hrefLink.hrefLink}
              </Text>
              <Text fontSize="18px" fontWeight="700" display={{ base: "flex", sm: "flex", md: "none" }}>
                Copied!
              </Text>
            </Flex>
          </Box>
        </Center>
      ),
    });
  });
  return <FiLink2 size={32} />;
};

export default memo(SharebuttonLinks);
