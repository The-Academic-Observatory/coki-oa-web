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
// Author: Aniek Roelofs

import React, { ReactNode } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";
import Icon from "./Icon";

interface TableFilterProps {
  tabIndex: number;
}

const TableFilter = ({ tabIndex, ...rest }: TableFilterProps) => {
  return (
    <Box gridArea="filter" borderRadius="md" boxShadow={{ base: "none", md: "md" }} overflow="hidden">
      <HStack bg="brand.500" justifyContent="center" spacing="10px" height="60px">
        <Box>
          <Icon icon="filter" color="white" size={24} />
        </Box>
        <Text fontWeight="900" fontSize="12px" textTransform="uppercase" color="white">
          {" "}
          Filters {tabIndex}{" "}
        </Text>
      </HStack>

      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton bg="white">
              <Box flex="1" textAlign="left">
                Region
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg="grey.300">
            <FormControl>
              <Box>
                {/*<FormLabel htmlFor="region">Region</FormLabel>*/}
                <Checkbox>Europe</Checkbox>
                <Checkbox>America</Checkbox>
                <Checkbox>Asia</Checkbox>
                <Checkbox>Africa</Checkbox>
                <Checkbox>Oceania</Checkbox>
              </Box>
            </FormControl>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Subregion
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default TableFilter;

// <FormControl>
//   <Box>
//     <FormLabel htmlFor="region">Region</FormLabel>
//     <Checkbox>Europe</Checkbox>
//     <Checkbox>America</Checkbox>
//     <Checkbox>Asia</Checkbox>
//     <Checkbox>Africa</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//   </Box>
//
//   <FormLabel htmlFor="subregion">SubRegion</FormLabel>
//   <Stack maxHeight="200px" overflow={"scroll"}>
//     <Checkbox>Europe</Checkbox>
//     <Checkbox>America</Checkbox>
//     <Checkbox>Asia</Checkbox>
//     <Checkbox>Africa</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//     <Checkbox>Oceania</Checkbox>
//   </Stack>
//   <FormLabel htmlFor="country">Country</FormLabel>
//   <Select id="country" placeholder="Select country">
//     <option>United Arab Emirates</option>
//     <option>Nigeria</option>
//   </Select>
// </FormControl>;
