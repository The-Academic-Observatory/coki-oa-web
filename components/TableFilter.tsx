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
import { useForm, Controller, ChangeHandler } from "react-hook-form";

const regions = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Latin America and the Caribbean", "Northern America"],
  Asia: ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
};
const RegionForm = (
  control: any,
  checkedSubRegions: { [x: string]: boolean },
  setCheckedSubRegions: any,
  setValue: any,
) => {
  const isChecked = (region: string) => {
    for (let subregion of regions[region]) {
      if (!checkedSubRegions[subregion]) {
        return false;
      }
    }
    return true;
  };
  return (
    <SimpleGrid columns={2} spacing={3}>
      {Object.keys(regions).map((region): ReactElement => {
        return (
          <Controller
            control={control}
            name={`region.${region}`}
            key={region}
            defaultValue={false}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox
                key={region}
                variant="tableFilter"
                colorScheme="checkbox"
                isChecked={isChecked(region)}
                onChange={(e) => {
                  const checkedSubRegionsCopy = JSON.parse(JSON.stringify(checkedSubRegions));
                  for (let subregion of regions[region]) {
                    checkedSubRegionsCopy[subregion] = e.target.checked;
                  }
                  setCheckedSubRegions(checkedSubRegionsCopy);
                  setValue("subregion", checkedSubRegionsCopy);
                }}
                ref={ref}
              >
                {region}
              </Checkbox>
            )}
          />
        );
      })}
    </SimpleGrid>
  );
};

const subRegions = {
  "Australia and New Zealand": false,
  "Central Asia": false,
  "Eastern Asia": false,
  "Eastern Europe": false,
  "Latin America and the Caribbean": false,
  Melanesia: false,
  Micronesia: false,
  "Northern Africa": false,
  "Northern America": false,
  "Northern Europe": false,
  Polynesia: false,
  "South-eastern Asia": false,
  "Southern Asia": false,
  "Southern Europe": false,
  "Sub-Saharan Africa": false,
  "Western Asia": false,
  "Western Europe": false,
};
const SubRegionForm = (
  control: any,
  checkedSubRegions: { [x: string]: boolean },
  setCheckedSubRegions: any,
  setValue: any,
) => {
  return (
    <FormControl>
      <Stack maxHeight="300px" overflow={"scroll"}>
        {Object.keys(subRegions).map((subregion): ReactElement => {
          return (
            <Controller
              control={control}
              name={`subregion.${subregion}`}
              key={subregion}
              defaultValue={false}
              render={({ field: { onChange, value, ref } }) => (
                <Checkbox
                  key={subregion}
                  variant="tableFilter"
                  colorScheme="checkbox"
                  isChecked={checkedSubRegions[subregion]}
                  onChange={(e) => {
                    const checkedSubRegionsCopy = JSON.parse(JSON.stringify(checkedSubRegions));
                    checkedSubRegionsCopy[subregion] = e.target.checked;
                    setCheckedSubRegions(checkedSubRegionsCopy);
                    setValue("subregion", checkedSubRegionsCopy);
                  }}
                  ref={ref}
                >
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

interface IFormInputs {
  region: any;
  subregion: any;
}

interface TableFilterProps {
  tabIndex: number;
  setFilterParams: (e: string) => void;
}
const TableFilter = ({ tabIndex, setFilterParams, ...rest }: TableFilterProps) => {
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>();
  // const watchRegions = watch("region");

  const transformFormResults = (formResults: { [x: string]: any }) => {
    return Object.keys(formResults)
      .reduce((result: string[], item) => {
        if (formResults[item]) {
          result.push(encodeURIComponent(item));
        }
        return result;
      }, [])
      .toString();
  };
  const onSubmit = handleSubmit((data: IFormInputs) => {
    // TODO remember filter values from the two different tabs
    const regionValues = transformFormResults(data.region);
    const subregionValues = transformFormResults(data.subregion);
    console.log(data, regionValues, subregionValues);
    const searchParams = [];
    if (regionValues) {
      searchParams.push(`regions=${regionValues}`);
    }
    if (subregionValues) {
      searchParams.push(`subregions=${subregionValues}`);
    }
    console.log(searchParams.join("&"));
    setFilterParams(searchParams.join("&"));
  });

  const onReset = () => {
    setFilterParams("");
  };

  const [checkedSubRegions, setCheckedSubRegions] = React.useState(subRegions);
  return (
    <form onSubmit={onSubmit} onReset={onReset}>
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
          <FilterAccordionItem
            name={"Region"}
            form={RegionForm(control, checkedSubRegions, setCheckedSubRegions, setValue)}
          />
          <FilterAccordionItem
            name={"SubRegion"}
            form={SubRegionForm(control, checkedSubRegions, setCheckedSubRegions, setValue)}
          />
        </Accordion>

        <HStack justifyContent="space-around" m={{ base: "none", md: "10px 0px" }}>
          <Button variant="tableFilter" type="reset">
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
