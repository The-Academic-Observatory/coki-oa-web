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
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchProps extends BoxProps {}

const Search = ({ ...rest }: SearchProps) => {
  return (
    <Box {...rest}>
      <InputGroup
        display={{ base: "none", md: "flex" }}
        borderColor="grey.900"
        bg="white"
        rounded={50}
        w={388}
      >
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.900" />}
        />
        <Input
          variant="outline"
          rounded={50}
          _placeholder={{ textTransform: "uppercase", color: "gray.900" }}
          color="gray.900"
          focusBorderColor="brand.400"
          fontWeight={500}
          placeholder="Search"
        />
      </InputGroup>
    </Box>
  );
};

export default Search;