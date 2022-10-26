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

import { Box, Flex, HStack, Image, Spacer, StackProps, Text, VStack } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import TextCollapse from "../common/TextCollapse";
import React, { memo } from "react";
import { makeDescription } from "./EntityDetails";
import SharebuttonLinks from "./SharebuttonLinks";

interface EntityHeaderProps extends StackProps {
  entity: Entity;
}

const Header = ({ entity, ...rest }: EntityHeaderProps) => {
  const previewText = makeDescription(entity);
  let description = <> {makeDescription(entity)} </>;
  if (entity.description.text !== "") {
    description = (
      <>
        {entity.description.text}{" "}
        <Box as="span" fontSize="14px" lineHeight="14px">
          Derived from{" "}
          <a href={entity.description.url} target="_blank" rel="noreferrer">
            Wikipedia
          </a>{" "}
          licensed {"  "}
          <a href={entity.description.license} target="_blank" rel="noreferrer">
            CC-BY-SA
          </a>
          .
        </Box>
      </>
    );
  }
  return (
    <VStack alignItems={"left"} pb={{ base: "16px", md: 0 }} {...rest}>
      <Flex justifyContent="space-between">
        <HStack pb={{ base: "12px", md: "12px" }}>
          <Box
            minWidth={{ base: "60px", md: "100px" }}
            width={{ base: "60px", md: "100px" }}
            height={{ base: "60px", md: "100px" }}
            mr={{ base: "10px", md: "24px" }}
          >
            <Image
              rounded="full"
              objectFit="cover"
              boxSize={{ base: "60px", md: "100px" }}
              src={entity.logo_l}
              alt={entity.name}
              style={{
                filter: "drop-shadow( 0px 0px 10px rgba(0, 0, 0, .2))",
              }}
            />
          </Box>

          <VStack alignItems="left">
            {/* TODO: Fix width of the flex to make the share button appear on the right */}
            {/* <Flex alignItems="center"> */}
            <Text as="h1" textStyle="entityHeading">
              {entity.name}
            </Text>
            <Box display={{ base: "block", sm: "block", md: "none" }}>
              <SharebuttonLinks
                entity={entity}
                category={entity.category}
                id={entity.id}
                isMobile={true}
                hrefCoki={`/${entity.category}/${entity.id}/`}
                iconTw={"twitter"}
                iconFb={"facebook"}
                iconLi={"linkedin"}
              />
            </Box>
            {/* </Flex> */}

            <Text textStyle="p" fontSize="24px" lineHeight="28px" display={{ base: "none", md: "block" }}>
              {description}
            </Text>
          </VStack>
        </HStack>
      </Flex>
      <TextCollapse
        display={{ base: "block", sm: "block", md: "none" }}
        previewText={previewText}
        text={description}
        showCollapse={entity.description.text !== ""}
      />
    </VStack>
  );
};

export default memo(Header);
