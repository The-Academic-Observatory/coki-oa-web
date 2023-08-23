// Copyright 2023 Curtin University
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

import { Box, BoxProps, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React, { memo } from "react";

interface NoResultsProps extends BoxProps {
  query: string;
}

const NoResults = ({ query, ...rest }: NoResultsProps) => {
  return (
    <Box py="16px" {...rest}>
      <Text textStyle="searchText">No results found for: &ldquo;{query}&rdquo;.</Text>
      <Text textStyle="searchText">Did you mean to:</Text>
      <UnorderedList textStyle="searchText" spacing="8px" pb="8px">
        <ListItem>
          Search for a country? E.g. &ldquo;Australia&rdquo;, &ldquo;Canada&rdquo;, or &ldquo;India&rdquo;.
        </ListItem>
        <ListItem>
          Look for an institution? Try names like &ldquo;Curtin University&rdquo;, &ldquo;Harvard&rdquo;, or
          &ldquo;Cambridge&rdquo;.
        </ListItem>
        <ListItem>
          Input an acronym? Examples include &ldquo;UK&rdquo;, &ldquo;MIT&rdquo;, or &ldquo;CERN&rdquo;.
        </ListItem>
        <ListItem>
          Explore a region? Options are &ldquo;Africa&rdquo;, &ldquo;Americas&rdquo;, &ldquo;Asia&rdquo;,
          &ldquo;Europe&rdquo;, or &ldquo;Oceania&rdquo;. Keep scrolling!
        </ListItem>
        <ListItem>Check your spelling and try different keywords.</ListItem>
      </UnorderedList>
    </Box>
  );
};

export default memo(NoResults);
