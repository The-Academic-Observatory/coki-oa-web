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

import React, { RefObject } from "react";
import {
  Box,
  BoxProps,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "lodash/debounce";
import Fuse from "fuse.js";
import Link from "./Link";
import { Entity } from "../lib/model";

interface SearchBoxProps {
  value: string;
  onChange: (e: any) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  return (
    <InputGroup
      borderColor="grey.900"
      bg="white"
      rounded={50}
      w={{ base: "full", std: 388 }}
    >
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.900" />
      </InputLeftElement>
      <Input
        value={value}
        variant="outline"
        rounded={50}
        _placeholder={{ textTransform: "uppercase", color: "gray.900" }}
        color="gray.900"
        focusBorderColor="brand.400"
        fontWeight={500}
        placeholder="Search"
        onChange={onChange}
      />
    </InputGroup>
  );
};

interface SearchResultProps extends BoxProps {
  entity: Entity;
  onClick: () => void;
}

const SearchResult = ({ entity, onClick, ...rest }: SearchResultProps) => {
  return (
    <Box key={entity.id}>
      <Link href={`/${entity.category}/${entity.id}`} onClick={onClick}>
        <HStack my="16px">
          <Image
            rounded="full"
            objectFit="cover"
            boxSize="16px"
            src={entity.logo_s}
            alt={entity.name}
          />
          <Text textStyle="tableCell">{entity.name}</Text>
        </HStack>
      </Link>
    </Box>
  );
};

interface SearchProps extends BoxProps {
  fuse: Fuse<any> | null;
}

export const Search = ({ fuse, ...rest }: SearchProps) => {
  const maxResults = 5;
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  // Search for entities
  const inputOnChange = debounce((value) => {
    if (value === "") {
      setPopoverOpen(false);
    } else if (fuse != null) {
      const results = fuse
        .search(value)
        .slice(0, maxResults)
        .map((item) => item.item);
      setSearchResults(results);
      setPopoverOpen(true);
    }
  }, 300);

  // When receive a click outside search input or popover, then close
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  useOutsideClick({
    ref: ref,
    handler: () => setPopoverOpen(false),
  });

  return (
    <Box {...rest} ref={ref}>
      <Popover
        placement="bottom-start"
        offset={[0, 1]}
        autoFocus={false}
        isLazy={true}
        isOpen={isPopoverOpen}
      >
        <PopoverAnchor>
          {/*div is required to prevent Function components cannot be given refs error */}
          <div>
            <SearchBox
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
          <PopoverBody>
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
            {searchText !== "" && searchResults.length === 0 && (
              <Text>No results</Text>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

interface SearchDrawerProps extends BoxProps {
  fuse: Fuse<any> | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  navbarHeightMobile: number;
}

export const SearchDrawer = ({
  fuse,
  isOpen,
  onOpen,
  onClose,
  navbarHeightMobile,
  ...rest
}: SearchDrawerProps) => {
  const maxResults = 5;
  const [searchText, setSearchText] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);

  // Search for entities
  const inputOnChange = debounce((value) => {
    if (value != "" && fuse != null) {
      const results = fuse
        .search(value)
        .slice(0, maxResults)
        .map((item) => item.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, 300);

  return (
    <Drawer
      size="full"
      placement="right"
      onClose={onClose}
      isOpen={isOpen}
      preserveScrollBarGap={true}
    >
      <DrawerContent
        top={`${navbarHeightMobile}px !important`}
        bg="none"
        boxShadow="none"
      >
        <DrawerHeader bg="brand.500">
          <SearchBox
            value={searchText}
            onChange={(e) => {
              const text = e.target.value;
              setSearchText(text);
              inputOnChange(text);
            }}
          />
        </DrawerHeader>
        <DrawerBody bg="white">
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
          {searchText != "" && searchResults.length === 0 && (
            <Text>No results</Text>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
