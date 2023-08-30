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

import { RemoveScroll } from "react-remove-scroll";
import { BoxProps, Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@chakra-ui/react";
import React, { memo } from "react";
import { Entity } from "../../lib/model";
import { useEntitySearch } from "./SearchDesktop";
import SearchResult from "./SearchResult";
import SearchBox from "./SearchBox";
import SkeletonSearchResult from "./SkeletonSearchResult";
import SearchTips from "./SearchTips";

interface SearchDrawerProps extends BoxProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  navbarHeightMobile: number;
}

const SearchMobile = ({ isOpen, onOpen, onClose, navbarHeightMobile, ...rest }: SearchDrawerProps) => {
  const [entities, query, setQuery, loading, setLoading, lastEntityRef, searchBoxOnChange, hasMore, queryFinal] =
    useEntitySearch(() => {});

  return (
    <RemoveScroll enabled={isOpen}>
      <Drawer
        autoFocus={true}
        trapFocus={true}
        size="full"
        placement="right"
        onClose={() => {
          // Close drawer and clear query
          onClose();
          setQuery("");
        }}
        isOpen={isOpen}
        preserveScrollBarGap={true}
        {...rest}
      >
        {/* Set % for height rather than vh otherwise on Safari iOS the address bar overlaps the scrolling content */}
        <DrawerContent
          top={`${navbarHeightMobile}px !important`}
          bg="none"
          boxShadow="none"
          height={`calc(100% - ${navbarHeightMobile}px)`}
        >
          <DrawerHeader bg="brand.500">
            <SearchBox
              inputDataTest="searchInputMobile"
              value={query}
              onFocus={(e) => {}}
              onChange={(e) => {
                searchBoxOnChange(e);
              }}
            />
          </DrawerHeader>
          <DrawerBody
            bg="white"
            data-test="searchResultsMobile"
            pt="2px"
            pb={0}
            // height={"calc(100vh + 68px)"}
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
                    onClose();
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </RemoveScroll>
  );
};

export default memo(SearchMobile);
