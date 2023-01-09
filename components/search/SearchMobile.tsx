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

import { BoxProps, Drawer, DrawerBody, DrawerContent, DrawerHeader, Text } from "@chakra-ui/react";
import React, { memo } from "react";
import debounce from "lodash/debounce";
import { OADataAPI } from "../../lib/api";
import { Entity } from "../../lib/model";
import { searchDebounce, searchLimit } from "./SearchDesktop";
import SearchResult from "./SearchResult";
import SearchBox from "./SearchBox";

interface SearchDrawerProps extends BoxProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  navbarHeightMobile: number;
}

const SearchMobile = ({ isOpen, onOpen, onClose, navbarHeightMobile, ...rest }: SearchDrawerProps) => {
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);

  // Search for entities
  const inputOnChange = debounce((value) => {
    if (value != "") {
      setIsFetching(true);
      const client = new OADataAPI();
      client
        .searchEntities(value, searchLimit)
        .then((data) => {
          //@ts-ignore
          setSearchResults(data);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, searchDebounce);

  return (
    <Drawer size="full" placement="right" onClose={onClose} isOpen={isOpen} preserveScrollBarGap={true}>
      <DrawerContent top={`${navbarHeightMobile}px !important`} bg="none" boxShadow="none">
        <DrawerHeader bg="brand.500">
          <SearchBox
            inputDataTest="searchInputMobile"
            value={searchText}
            onChange={(e) => {
              const text = e.target.value;
              setSearchText(text);
              inputOnChange(text);
            }}
          />
        </DrawerHeader>
        <DrawerBody bg="white" data-test="searchResultsMobile">
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
                onClose();
                setSearchResults([]);
                setSearchText("");
              }}
            />
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default memo(SearchMobile);
