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

import {
  Box,
  BoxProps,
  Button,
  Grid,
  GridItem,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useClipboard,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { FiLink2, FiShare2 } from "react-icons/fi";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

import { useRouter } from "next/router";
import { Entity } from "../../lib/model";

interface SharePopoverProps extends BoxProps {
  entity: Entity;
  platform: string;
}

const SharePopover = ({ entity, platform, ...rest }: SharePopoverProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const url = `${process.env.NEXT_PUBLIC_HOST}${useRouter().asPath}`; // Get URL of current route
  const text = encodeURIComponent(
    `Check out the Open Access statistics for ${entity.name} on the COKI Open Access Dashboard:`,
  );

  // Open URL in a new tab
  const openUrlTab = (url: string) => {
    window.open(url, "_blank", "noreferrer,noopener");
  };

  // Copy link button hook
  const { onCopy } = useClipboard(url);

  // Copy link to clipboard and show toast
  const toast = useToast();
  const [isGreaterThan] = useMediaQuery("(min-width: 400px)");

  const openLinkCopyToast = () => {
    // Copy link to clipboard
    onCopy();

    // Set description
    // Don't show description for very small screens as takes up too much space
    let description = null;
    if (isGreaterThan) {
      description = url;
    }

    // Show toast
    toast({
      title: "Link copied to clipboard",
      description: description,
      status: "success",
      duration: 2000,
      isClosable: false,
    });
  };

  const size = "24px";
  const encodedUrl = encodeURIComponent(url);
  const shareLinks = [
    {
      text: "Link",
      href: url,
      icon: <FiLink2 size={size} />,
      action: openLinkCopyToast,
      description: "Copy link to clipboard.",
    },
    {
      text: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}&hashtags=OpenAccess,COKI&via=COKIproject`,
      icon: <FaTwitter size={size} />,
      action: openUrlTab,
      description: "Share on Twitter.",
    },
    {
      text: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FaFacebook size={size} />,
      action: openUrlTab,
      description: "Share on Facebook.",
    },
    {
      text: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`,
      icon: <FaLinkedin size={size} />,
      action: openUrlTab,
      description: "Share on LinkedIn.",
    },
  ];

  return (
    <Box {...rest}>
      <Popover variant="sharePopover" isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger data-test="share-popover-trigger">
          <Button data-test={`${platform}-share-button`} variant="share" leftIcon={<FiShare2 />} onClick={onToggle}>
            <Text display={{ base: "none", sm: "block" }}>Share</Text>
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent data-test={`${platform}-share-popover-content`}>
            <PopoverArrow />
            <PopoverBody>
              <Grid templateRows="repeat(3)" templateColumns="repeat(2, 1fr)" justifyItems="center" gap="12px">
                {shareLinks.map((item) => {
                  const id = `share-${item.text.toLowerCase()}`;
                  return (
                    <GridItem key={id}>
                      <IconButton
                        data-test={id}
                        variant="iconText"
                        aria-label={item.description}
                        onClick={() => {
                          // Run action
                          item.action(item.href);

                          // Close popover
                          onClose();
                        }}
                      >
                        <VStack>
                          {item.icon}
                          <Text marginTop="3px !important" fontSize="14px">
                            {item.text}
                          </Text>
                        </VStack>
                      </IconButton>
                    </GridItem>
                  );
                })}
              </Grid>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default memo(SharePopover);
