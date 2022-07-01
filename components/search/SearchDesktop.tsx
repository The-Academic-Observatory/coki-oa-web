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

import React, { memo } from "react";
import { Box, Popover, PopoverAnchor, PopoverBody, PopoverContent, Text, useOutsideClick } from "@chakra-ui/react";
import debounce from "lodash/debounce";
import { Entity } from "../../lib/model";
import { makeSearchUrl } from "../../lib/api";
import SearchResult from "./SearchResult";
import SearchBox from "./SearchBox";

export const searchLimit = 10;
export const searchDebounce = 300;

const SearchDesktop = ({ ...rest }) => {
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  // Search for entities
  const inputOnChange = debounce((value) => {
    if (value === "") {
      setPopoverOpen(false);
    } else {
      setIsFetching(true);
      const url = makeSearchUrl(value, searchLimit);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data);
          setIsFetching(false);
          setPopoverOpen(true);
        });
    }
  }, searchDebounce);

  // When receive a click outside search input or popover, then close
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  useOutsideClick({
    ref: ref,
    handler: () => setPopoverOpen(false),
  });

  return (
    <Box {...rest} ref={ref}>
      <Popover placement="bottom-start" offset={[0, 1]} autoFocus={false} isLazy={true} isOpen={isPopoverOpen}>
        <PopoverAnchor>
          {/*div is required to prevent Function components cannot be given refs error */}
          <div>
            <SearchBox
              inputDataTest="searchInputDesktop"
              value={searchText}
              onChange={(e) => {
                const text = e.target.value;
                setSearchText(text);
                inputOnChange(text);
              }}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          borderRadius={14}
          width={"386px"}
          _focus={{
            boxShadow: "none",
          }}
        >
          <PopoverBody data-test="searchResultsDesktop">
            {!isFetching && searchText !== "" && searchResults.length === 0 && <Text>No results</Text>}
            {searchResults.map((entity: Entity) => (
              <SearchResult
                key={entity.id}
                entity={entity}
                onClick={() => {
                  // On click:
                  // - Close search results
                  // - Reset research results
                  // - Set search text to empty string
                  setPopoverOpen(false);
                  setSearchResults([]);
                  setSearchText("");
                }}
              />
            ))}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default memo(SearchDesktop);
