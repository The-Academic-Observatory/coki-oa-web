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

import { Box, BoxProps, Flex, Tag, TagLabel, Text, VStack } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import EntityCard from "./EntityCard";
import React, { memo } from "react";
import MetadataLink from "./MetadataLink";

interface MetadataCardProps extends BoxProps {
  entity: Entity;
  isMobile: boolean;
}

const MetadataCard = ({ entity, isMobile, ...rest }: MetadataCardProps) => {
  // Include wikipedia and or website URLs if they exist for the entity
  let wikipedia = <></>;
  if (entity.wikipedia_url) {
    wikipedia = (
      <MetadataLink
        icon={"wikipedia"}
        name={"Wikipedia"}
        target="_blank"
        rel="noreferrer"
        href={entity.wikipedia_url}
      />
    );
  }

  let website = <></>;
  if (entity.url) {
    //TODO: clean urls in workflow
    if (entity.url.endsWith("//")) {
      entity.url = entity.url.slice(0, -1);
    }

    website = <MetadataLink icon={"website"} name={"Website"} target="_blank" rel="noreferrer" href={entity.url} />;
  }

  // Create tags
  let tags = [];
  if (entity.category === "institution") {
    tags.push(entity.country);
    tags = tags.concat(entity.institution_types);
  } else {
    tags.push(entity.subregion);
    tags.push(entity.region);
  }

  let content;
  if (isMobile) {
    content = (
      <Box {...rest}>
        <hr />
        <VStack px="12px" py="32px">
          <Flex w="full" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {wikipedia}
            {website}
            <MetadataLink icon={"download"} name={"Download"} href={"/data/"} />
            <MetadataLink icon={"code"} name={"Embed"} href={`/${entity.category}/${entity.id}/`} />
          </Flex>

          <Flex w="full" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {entity.identifiers.map((obj: any) => {
              return (
                <Text key={obj.id} textStyle="entityID">
                  {obj.type}:{" "}
                  <Text as="span" textStyle="entityBold">
                    {obj.id}
                  </Text>
                </Text>
              );
            })}
          </Flex>
        </VStack>
      </Box>
    );
  } else {
    content = (
      <EntityCard display={{ base: "none", md: "block" }} {...rest}>
        <Flex h="full" flexDirection="column" justifyContent="space-between">
          {wikipedia}
          {website}
          <MetadataLink icon={"download"} name={"Download"} href={"/data/"} />
          <MetadataLink icon={"code"} name={"Embed"} href={`/${entity.category}/${entity.id}/`} />

          {tags.map((tag: any) => {
            return (
              <Tag size={"md"} key={tag} borderRadius="full" variant="solid" backgroundColor="#737373">
                <TagLabel margin={"auto"}>{tag}</TagLabel>
              </Tag>
            );
          })}
        </Flex>
      </EntityCard>
    );
  }

  return <>{content} </>;
};

export default memo(MetadataCard);
