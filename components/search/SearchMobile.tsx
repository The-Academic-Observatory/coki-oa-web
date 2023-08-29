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
import { BoxProps, Drawer, DrawerBody, DrawerContent, DrawerHeader, Text } from "@chakra-ui/react";
import React, { memo } from "react";
import { Entity } from "../../lib/model";
import { useEntitySearch } from "./SearchDesktop";
import SearchResult from "./SearchResult";
import SearchBox from "./SearchBox";
import SkeletonSearchResult from "./SkeletonSearchResult";
import NoResults from "./NoResults";

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
        <DrawerContent
          top={`${navbarHeightMobile}px !important`}
          bg="none"
          boxShadow="none"
          height={`calc(100vh - ${navbarHeightMobile}px)`}
        >
          <DrawerHeader bg="brand.500">
            <SearchBox
              inputDataTest="searchInputMobile"
              value={query}
              onChange={(e) => {
                searchBoxOnChange(e);
              }}
            />
          </DrawerHeader>
          <DrawerBody bg="white" data-test="searchResultsMobile" pt="2px" pb={0} height="100vh" overflowY="auto">
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
            {hasMore && <SkeletonSearchResult lastEntityRef={lastEntityRef} />}

            {/* No results helper information */}
            {!loading && query !== "" && entities.length === 0 && <NoResults query={queryFinal} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </RemoveScroll>
  );
};

export default memo(SearchMobile);
