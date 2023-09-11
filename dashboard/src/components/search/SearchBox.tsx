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

import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { memo } from "react";

interface SearchBoxProps {
  value: string;
  onFocus: (e: any) => void;
  onChange: (e: any) => void;
  inputDataTest: string;
  autoFocus: boolean;
}

const SearchBox = ({ value, onFocus, onChange, inputDataTest, autoFocus }: SearchBoxProps) => {
  return (
    <InputGroup borderColor="grey.900" bg="white" rounded={50} w={{ base: "full", std: 388 }}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.900" />
      </InputLeftElement>
      <Input
        autoFocus={autoFocus}
        data-test={inputDataTest}
        value={value}
        variant="outline"
        rounded={50}
        _placeholder={{ textTransform: "uppercase", color: "gray.900" }}
        color="gray.900"
        focusBorderColor="brand.400"
        fontWeight={500}
        placeholder="Search"
        onFocus={onFocus}
        onChange={onChange}
        autoCapitalize="none"
      />
    </InputGroup>
  );
};

export default memo(SearchBox);
