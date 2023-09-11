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

import React, { memo } from "react";
import { Box, BoxProps, ListItem, Text, UnorderedList } from "@chakra-ui/react";

interface SearchTipsProps extends BoxProps {
  query: string;
  showNoResults: boolean;
}

const capitalize = (text: string, capitalize: boolean) => {
  if (capitalize) {
    return text.toUpperCase();
  } else {
    return text.toLowerCase();
  }
};

const SearchTips = ({ query, showNoResults, ...rest }: SearchTipsProps) => {
  let punctuation = "?";
  if (!showNoResults) {
    punctuation = ":";
  }
  return (
    <Box py="16px" {...rest}>
      {showNoResults && (
        <>
          <Text textStyle="searchText">No results found for: &ldquo;{query}&rdquo;.</Text>
          <Text textStyle="searchText">Did you mean to:</Text>
        </>
      )}

      {!showNoResults && (
        <>
          <Text textStyle="searchText">Hey there! Not sure where to start?</Text>
          <Text textStyle="searchText">Here are some tips to help you find what you&apos;re looking for:</Text>
        </>
      )}

      <UnorderedList textStyle="searchText" spacing="8px" pb="8px">
        <ListItem>
          Search for a country{punctuation} {capitalize("e", showNoResults)}.g. &ldquo;Australia&rdquo;,
          &ldquo;Canada&rdquo;, or &ldquo;India&rdquo;.
        </ListItem>
        <ListItem>
          Look for an institution{punctuation} {capitalize("t", showNoResults)}ry names like &ldquo;Curtin
          University&rdquo;, &ldquo;Harvard&rdquo;, or &ldquo;Cambridge&rdquo;.
        </ListItem>
        <ListItem>
          Input an acronym in uppercase{punctuation} {capitalize("e", showNoResults)}xamples include &ldquo;UK&rdquo;,
          &ldquo;MIT&rdquo;, or &ldquo;CERN&rdquo;.
        </ListItem>
        <ListItem>
          Explore a region{punctuation} {capitalize("o", showNoResults)}ptions are &ldquo;Africa&rdquo;,
          &ldquo;Americas&rdquo;, &ldquo;Asia&rdquo;, &ldquo;Europe&rdquo;, or &ldquo;Oceania&rdquo;. Keep scrolling!
        </ListItem>
        {showNoResults && <ListItem>Check your spelling and try different keywords.</ListItem>}
      </UnorderedList>
    </Box>
  );
};

export default memo(SearchTips);
