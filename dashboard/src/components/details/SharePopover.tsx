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

import { Link } from "@/components/common";
import { Entity } from "@/lib/model";
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
import { useRouter } from "next/router";
import React, { memo, ReactElement } from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiLink2, FiShare2 } from "react-icons/fi";

interface SharePopoverProps extends BoxProps {
  entity: Entity;
  platform: string;
}

const SharePopover = ({ entity, platform, ...rest }: SharePopoverProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const url = `${process.env.COKI_SITE_URL}${useRouter().asPath}`; // Get URL of current route
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
                <GridItem key="share-link">
                  <ShareIconButton
                    dataTest="share-link"
                    icon={<FiLink2 size={size} />}
                    text="Link"
                    description="Copy link to clipboard."
                    onClick={() => {
                      openLinkCopyToast();
                      // Close popover
                      onClose();
                    }}
                  />
                </GridItem>

                {shareLinks.map((item) => {
                  const id = `share-${item.text.toLowerCase()}`;
                  return (
                    <GridItem key={id}>
                      <Link data-test={id} href={item.href} isExternal>
                        <ShareIconButton
                          icon={item.icon}
                          text={item.text}
                          description={item.description}
                          onClick={() => {
                            // Close popover
                            onClose();
                          }}
                        />
                      </Link>
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

interface ShareIconButtonProps {
  icon: ReactElement;
  text: string;
  description: string;
  onClick: () => void;
  dataTest?: string;
}

const ShareIconButton = ({ icon, text, description, onClick, dataTest }: ShareIconButtonProps) => {
  return (
    <IconButton data-test={dataTest} variant="iconText" aria-label={description} onClick={onClick}>
      <VStack>
        {icon}
        <Text marginTop="3px !important" fontSize="14px">
          {text}
        </Text>
      </VStack>
    </IconButton>
  );
};

export default memo(SharePopover);
