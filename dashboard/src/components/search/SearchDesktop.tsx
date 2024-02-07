// Copyright 2022-2024 Curtin University
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

import { SearchBox, SearchResult, SearchTips, SkeletonSearchResult, useEntitySearch } from "@/components/search";
import { Entity } from "@/lib/model";
import { Box, Popover, PopoverAnchor, PopoverBody, PopoverContent, useOutsideClick } from "@chakra-ui/react";
import React, { memo } from "react";
import { RemoveScroll } from "react-remove-scroll";

const SearchDesktop = ({ ...rest }) => {
  // Control search popover behaviour
  // When receive a click outside search input or popover, then close
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  useOutsideClick({
    ref: ref,
    handler: () => {
      // Close popover and clear text when click outside
      setPopoverOpen(false);
      setQuery("");
    },
  });

  // Search query
  const { entities, query, setQuery, lastEntityRef, searchBoxOnChange, hasMore, queryFinal } = useEntitySearch(() => {
    setPopoverOpen(true);
  });

  return (
    <Box {...rest} ref={ref}>
      <RemoveScroll enabled={isPopoverOpen} removeScrollBar={false}>
        <Popover placement="bottom-start" offset={[0, 1]} autoFocus={false} isLazy={true} isOpen={isPopoverOpen}>
          <PopoverAnchor>
            {/*div is required to prevent Function components cannot be given refs error */}
            <div>
              <SearchBox
                inputDataTest="searchInputDesktop"
                value={query}
                onFocus={() => {
                  setPopoverOpen(true);
                }}
                onChange={(e: any) => {
                  if (e.target.value === "") {
                    setPopoverOpen(false);
                  }
                  searchBoxOnChange(e);
                }}
                autoFocus={false}
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            borderRadius={14}
            width="386px"
            _focus={{
              boxShadow: "none",
            }}
          >
            <PopoverBody
              id="searchResultsDesktop"
              data-test="searchResultsDesktop"
              py={0}
              px="16px"
              maxHeight="500px"
              overflowY="auto"
            >
              {/* Search results */}
              {entities.map((entity: Entity) => {
                return (
                  <SearchResult
                    key={entity.id}
                    entity={entity}
                    onClick={() => {
                      // On click:
                      // - Close search results
                      // - Set search text to empty string
                      setPopoverOpen(false);
                      setQuery("");
                    }}
                  />
                );
              })}

              {/* Skeleton search item which loads more results */}
              {entities.length !== 0 && hasMore && <SkeletonSearchResult lastEntityRef={lastEntityRef} />}

              {/* No results helper information */}
              {entities.length === 0 && (
                <SearchTips query={queryFinal} showNoResults={queryFinal.trim() !== "" && entities.length === 0} />
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </RemoveScroll>
    </Box>
  );
};

export default memo(SearchDesktop);
