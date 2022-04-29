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

import React, { ReactElement } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  FormControl,
  SimpleGrid,
  Stack,
  Text,
  HStack,
  FormControlProps,
  Button,
} from "@chakra-ui/react";
import Icon from "./Icon";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useForm, Controller } from "react-hook-form";

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const RegionForm = (control: any) => {
  return (
    <SimpleGrid columns={2} spacing={3}>
      {regions.map((region): ReactElement => {
        return (
          <Controller
            control={control}
            name={region}
            key={region}
            defaultValue={false}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox variant="tableFilter" colorScheme="checkbox" onChange={onChange} ref={ref}>
                {region}
              </Checkbox>
            )}
          />
        );
      })}
    </SimpleGrid>
  );
};

const subRegions = [
  "Australia and New Zealand",
  "Central Asia",
  "Eastern Asia",
  "Eastern Europe",
  "Latin America and the Caribbean",
  "Melanesia",
  "Micronesia",
  "Northern Africa",
  "Northern America",
  "Northern Europe",
  "Polynesia",
  "South-eastern Asia",
  "Southern Asia",
  "Southern Europe",
  "Sub-Saharan Africa",
  "Western Asia",
  "Western Europe",
];
const SubRegionForm = (control: any) => {
  return (
    <FormControl>
      <Stack maxHeight="300px" overflow={"scroll"}>
        {subRegions.map((subregion): ReactElement => {
          return (
            <Controller
              control={control}
              name={subregion}
              key={subregion}
              defaultValue={false}
              render={({ field: { onChange, value, ref } }) => (
                <Checkbox variant="tableFilter" colorScheme="checkbox" onChange={onChange} ref={ref}>
                  {subregion}
                </Checkbox>
              )}
            />
          );
        })}
      </Stack>
    </FormControl>
  );
};

interface FilterAccordionItemProps {
  name: string;
  form: FormControlProps;
}

const FilterAccordionItem = ({ name, form }: FilterAccordionItemProps) => {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" textStyle="tableHeader">
                {name}
              </Box>
              {isExpanded ? <CloseIcon fontSize="12px" /> : <AddIcon fontSize="12px" />}
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg="grey.300">
            {form}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

interface TableFilterProps {
  tabIndex: number;
  setFilterParams: (e: string) => void;
}

const TableFilter = ({ tabIndex, setFilterParams, ...rest }: TableFilterProps) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    //TODO get submit data separate for regions/subregions
    console.log(data);
    const searchText = "regions=Asia";
    setFilterParams(searchText);
  });

  return (
    <form onSubmit={onSubmit}>
      <Box borderRadius="md" boxShadow={{ base: "none", md: "md" }} overflow={"hidden"}>
        <HStack bg="brand.500" justifyContent="center" spacing="10px" height="60px">
          <Box>
            <Icon icon="filter" color="white" size={24} />
          </Box>
          <Text fontWeight="900" fontSize="12px" textTransform="uppercase" color="white">
            {" "}
            Filters {tabIndex}{" "}
          </Text>
        </HStack>

        <Accordion defaultIndex={[0]} allowMultiple variant="tableFilter">
          <FilterAccordionItem name={"Region"} form={RegionForm(control)} />
          <FilterAccordionItem name={"SubRegion"} form={SubRegionForm(control)} />
        </Accordion>

        <HStack justifyContent="space-around" m={{ base: "none", md: "10px 0px" }}>
          <Button variant="tableFilter">
            <Text>Clear Filters</Text>
          </Button>

          <Button variant="table" type="submit">
            <Text>Apply Filters</Text>
          </Button>
        </HStack>
      </Box>
    </form>
  );
};

export default TableFilter;
