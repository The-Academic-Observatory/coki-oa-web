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

import React from "react";
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
  onChange: (e: any) => void;
}

const SearchBox = ({ onChange }: SearchBoxProps) => {
  return (
    <InputGroup
      borderColor="grey.900"
      bg="white"
      rounded={50}
      w={{ base: "full", md: 388 }}
    >
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.900" />
      </InputLeftElement>
      <Input
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
  fuse: Fuse<any>;
}

export const Search = ({ fuse, ...rest }: SearchProps) => {
  const maxResults = 5;
  const [searchResults, setSearchResults] = React.useState([]);
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);

  // Search for entities
  const inputOnChange = debounce((value) => {
    if (value === "") {
      setPopoverOpen(false);
    } else {
      const results = fuse
        .search(value)
        .slice(0, maxResults)
        .map((item) => item.item);
      setSearchResults(results);
      setPopoverOpen(true);
    }
  }, 300);

  // When receive a click outside search input or popover, then close
  const ref = React.useRef();
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
            <SearchBox onChange={(e) => inputOnChange(e.target.value)} />
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
            {searchResults.map((entity) => (
              <SearchResult
                key={entity.id}
                entity={entity}
                onClick={() => setPopoverOpen(false)}
              />
            ))}
            {searchResults.length === 0 && <Text>No results</Text>}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

interface SearchDrawerProps extends BoxProps {
  fuse: Fuse<any>;
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
  const [searchResults, setSearchResults] = React.useState([]);

  // Search for entities
  const inputOnChange = debounce((value) => {
    if (value != "") {
      const results = fuse
        .search(value)
        .slice(0, maxResults)
        .map((item) => item.item);
      setSearchResults(results);
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
          <SearchBox onChange={(e) => inputOnChange(e.target.value)} />
        </DrawerHeader>
        <DrawerBody bg="white">
          {searchResults.map((entity: Entity) => (
            <SearchResult key={entity.id} entity={entity} onClick={onClose} />
          ))}
          {searchResults.length === 0 && <Text>No results</Text>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
