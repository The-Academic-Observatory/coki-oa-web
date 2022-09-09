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

import { Flex, LinkProps, HStack, Button, Portal } from "@chakra-ui/react";
import Link from "../common/Link";
import Icon from "../common/Icon";
import React, { memo } from "react";
import { useClipboard } from "@chakra-ui/react";
import MetadataLink from "./MetadataLink";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";

interface SharebuttonLinksProps extends LinkProps {
  name: string;
  buttonHeader: string;
  category: string;
  id: string;
  hrefCoki: string;
  iconTw: string;
  iconFb: string;
  iconLi: string;
}

// Needs to have the info on if it's region or institution for the tweet.
const SharebuttonLinks = ({
  name,
  buttonHeader,
  category,
  id,
  hrefCoki,
  iconTw,
  iconFb,
  iconLi,
  ...rest
}: SharebuttonLinksProps) => {
  // if institution
  // or if country
  var shareText = encodeURIComponent(`COKI Open Access Dashboard:\n`);

  if (hrefCoki === undefined) {
    hrefCoki = "https://open.coki.ac";
  } else {
    hrefCoki = "https://open.coki.ac" + hrefCoki.slice(0, -1);
  }

  const hrefTw = "https://twitter.com/intent/tweet?text=" + shareText + "&url=" + hrefCoki;
  const hrefFb = "https://www.facebook.com/sharer/sharer.php?u=" + hrefCoki + "&quote=" + shareText;
  const hrefLi = "https://www.linkedin.com/shareArticle?mini=true&url=" + hrefCoki + "&text=" + shareText;

  // Copy link
  const [value, setValue] = React.useState(hrefCoki);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Share</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="min" height="min">
          <PopoverArrow />
          {/* <PopoverHeader>Share this card to</PopoverHeader> */}
          {/* <PopoverCloseButton />  Should we include this*/}
          <PopoverBody>
            <Flex alignItems="center" justifyContent="center">
              <HStack>
                <Link href={hrefTw} target="_blank" rel="noreferrer">
                  <Icon icon={iconTw} size={32} color={"#101820"} />
                </Link>
                <Link href={hrefFb} target="_blank" rel="noreferrer">
                  <Icon icon={iconFb} size={32} color={"#101820"} />
                </Link>
                <Link href={hrefLi} target="_blank" rel="noreferrer">
                  <Icon icon={iconLi} size={32} color={"#101820"} />
                </Link>

                <Button onClick={onCopy} ml={2}>
                  {hasCopied ? "Copied!" : "Copy Link"}
                </Button>

                {/* Other formatting for the share button
                            <MetadataLink icon={iconTw} href={hrefTw} name={""} />
                            <MetadataLink icon={iconFb} href={hrefFb} name={""} />
                            <MetadataLink icon={iconLi} href={hrefLi} name={""} />  */}
              </HStack>
            </Flex>
          </PopoverBody>
          {/* <PopoverFooter>This is the footer</PopoverFooter> */}
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default memo(SharebuttonLinks);

{
  /* <Button colorScheme='blue'>Button</Button>
                    <Link href={hrefTwitter} {...rest}>
                        <Flex align="center" role="group" cursor="pointer">
                            <Icon mr="2" icon={twicon} size={32} color={"#101820"} />
                        </Flex>
                    </Link> */
}
