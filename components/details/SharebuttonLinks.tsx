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

import { useToast, LinkProps, HStack, Box, Button, Portal, Text, VStack } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import MetadataLink from "./MetadataLink";
import React, { memo } from "react";
import { useClipboard } from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from "@chakra-ui/react";
import { FiShare2, FiLink2 } from "react-icons/fi";

interface SharebuttonLinksProps extends LinkProps {
  category: string;
  id: string;
  hrefCoki: string;
  iconTw: string;
  iconFb: string;
  iconLi: string;
}

// Needs to have the info on if it's region or institution for the tweet.
const SharebuttonLinks = ({ category, id, hrefCoki, iconTw, iconFb, iconLi, ...rest }: SharebuttonLinksProps) => {
  var shareText = encodeURIComponent(`COKI Open Access Dashboard:\n`);

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

  // Copy link button
  const [value] = React.useState(hrefCoki);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="shareButton">
          <HStack paddingRight="15px">
            <FiShare2 size={24} />
          </HStack>
          <Text casing="uppercase">Share</Text>
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="min-content" height="min-content" _focus={{ border: "grey.500" }}>
          <PopoverArrow />
          <PopoverBody>
            <Grid templateRows="repeat(3)" templateColumns="repeat(2, 1fr)">
              <GridItem padding="6px">
                <VStack>
                  <Button
                    id="copy-link-button"
                    onClick={onCopy}
                    size="min"
                    _focus={{ border: "none" }}
                    bgColor="white"
                    _hover={{ bgColor: "none" }}
                  >
                    {hasCopied ? <CopyLink /> : <FiLink2 size={32} />}
                  </Button>
                  <Text size="10px">Link</Text>
                </VStack>
              </GridItem>
              <GridItem padding="6px">
                <VStack>
                  <MetadataLink icon={iconTw} href={hrefTw} />
                  <Text size="10px">Twitter</Text>
                </VStack>
              </GridItem>
              <GridItem padding="6px">
                <VStack>
                  <MetadataLink icon={iconFb} href={hrefFb} />
                  <Text size="10px">Facebook</Text>
                </VStack>
              </GridItem>
              <GridItem padding="6px">
                <VStack>
                  <MetadataLink icon={iconLi} href={hrefLi} />
                  <Text size="10px">LinkedIn</Text>
                </VStack>
              </GridItem>
              <GridItem padding="6px" colSpan={2}>
                <VStack>
                  <MetadataLink icon="code" />
                  <Text size="10px">Embed</Text>
                </VStack>
              </GridItem>
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

// The useEffect stops the toast popup from appearing multiple times.
const CopyLink = () => {
  const toast = useToast();
  React.useEffect(() => {
    toast({
      title: "Clicked!",
      duration: 1000,
      isClosable: false,
    });
  });
  return <FiLink2 size={32} />;
};

export default memo(SharebuttonLinks);
