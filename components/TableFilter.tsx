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
  VStack,
  FormControlProps,
  Button,
  RangeSlider,
  RangeSliderMark,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
  Heading,
  StackDivider,
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
const regionForm = (
  control: any,
  checkedSubregions: { [x: string]: boolean },
  setCheckedSubregions: any,
  setValue: any,
) => {
  const isChecked = (region: string) => {
    for (let subregion of regions[region]) {
      if (!checkedSubregions[subregion]) {
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
                  const checkedSubregionsCopy = JSON.parse(JSON.stringify(checkedSubregions));
                  for (let subregion of regions[region]) {
                    checkedSubregionsCopy[subregion] = e.target.checked;
                  }
                  setCheckedSubregions(checkedSubregionsCopy);
                  setValue("subregion", checkedSubregionsCopy);
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

const subregions = {
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
const subregionForm = (
  control: any,
  checkedSubregions: { [x: string]: boolean },
  setCheckedSubregions: any,
  setValue: any,
) => {
  // TODO group per region?
  return (
    <FormControl>
      <Stack maxHeight="300px" overflow={"scroll"}>
        {Object.keys(subregions).map((subregion): ReactElement => {
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
                  isChecked={checkedSubregions[subregion]}
                  onChange={(e) => {
                    const checkedSubregionsCopy = JSON.parse(JSON.stringify(checkedSubregions));
                    checkedSubregionsCopy[subregion] = e.target.checked;
                    setCheckedSubregions(checkedSubregionsCopy);
                    setValue("subregion", checkedSubregionsCopy);
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

const institutionTypes = [
  "Archive",
  "Company",
  "Education",
  "Facility",
  "Government",
  "Healthcare",
  "Nonprofit",
  "Other",
];
const institutionTypeForm = (control: any) => {
  return (
    <SimpleGrid columns={2} spacing={3}>
      {institutionTypes.map((institutionType): ReactElement => {
        return (
          <Controller
            control={control}
            name={`institutionType.${institutionType}`}
            key={institutionType}
            defaultValue={false}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox variant="tableFilter" colorScheme="checkbox" isChecked={!!value} onChange={onChange} ref={ref}>
                {institutionType}
              </Checkbox>
            )}
          />
        );
      })}
    </SimpleGrid>
  );
};

const stats = ["Total Publications", "Open Publications", "% Open Publications"];
const statsForm = (control: any) => {
  return (
    <VStack align={"stretch"} divider={<StackDivider borderColor="grey.500" />}>
      {stats.map((statsType): ReactElement => {
        const [sliderValue, setSliderValue] = React.useState([0, 10]);

        return (
          <Controller
            key={statsType}
            control={control}
            name={statsType}
            defaultValue={false}
            render={({ field: { onChange, value, ref } }) => (
              <Box>
                <Box>
                  <Text textStyle="tableHeader">{statsType}</Text>
                </Box>
                <RangeSlider
                  aria-label={["min", "max"]}
                  defaultValue={[10, 30]}
                  onChange={setSliderValue}
                  //TODO make dynamic
                  h={"85px"}
                  variant={"tableFilter"}
                >
                  <RangeSliderMark // TODO define min and max values
                    value={0}
                    mt="5"
                    ml="-2.5"
                    fontSize="sm"
                  >
                    0
                  </RangeSliderMark>
                  <RangeSliderMark value={100} mt="5" ml="-2.5" fontSize="sm">
                    100
                  </RangeSliderMark>
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <Tooltip
                    hasArrow
                    label={sliderValue[0]}
                    bg="brand.500"
                    rounded={"md"}
                    color="white"
                    placement="top"
                    pl={2}
                    pr={2}
                    //TODO keep open while accordionitem is expanded
                  >
                    <RangeSliderThumb index={0} boxSize={5} />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={sliderValue[1]}
                    bg="brand.500"
                    rounded={"md"}
                    color="white"
                    placement="top"
                    pl={2}
                    pr={2}
                    //TODO keep open while accordionitem is expanded
                  >
                    <RangeSliderThumb index={1} boxSize={5} />
                  </Tooltip>
                </RangeSlider>
              </Box>
            )}
          />
        );
      })}
    </VStack>
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
          <AccordionPanel pb={4} bg="#F9FAFA">
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
  institutionType: any;
}

interface TableFilterProps {
  tabIndex: number;
  setFilterParamsCountry: (e: string) => void;
  setFilterParamsInstitution: (e: string) => void;
  setPageParamsCountry: (e: string) => void;
  setPageParamsInstitution: (e: string) => void;
}
const TableFilter = ({
  tabIndex,
  setFilterParamsCountry,
  setFilterParamsInstitution,
  setPageParamsCountry,
  setPageParamsInstitution,
  ...rest
}: TableFilterProps) => {
  const { handleSubmit, control, setValue, reset } = useForm<IFormInputs>();
  const [checkedSubregionsCountry, setCheckedSubregionsCountry] = React.useState(subregions);
  const [checkedSubregionsInstitution, setCheckedSubregionsInstitution] = React.useState(subregions);

  const checkedSubregions = tabIndex === 0 ? checkedSubregionsCountry : checkedSubregionsInstitution;
  const setCheckedSubregions = tabIndex === 0 ? setCheckedSubregionsCountry : setCheckedSubregionsInstitution;

  const transformFormResults = (formResults: { [x: string]: any }) => {
    if (formResults === undefined) {
      return "";
    }
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
    const regionValues = transformFormResults(data.region);
    const subregionValues = transformFormResults(data.subregion);
    const institutionTypeValues = transformFormResults(data.institutionType);
    console.log(data, regionValues, subregionValues, institutionTypeValues);
    const searchParams = [];
    if (regionValues) {
      searchParams.push(`regions=${regionValues}`);
    }
    if (subregionValues) {
      searchParams.push(`subregions=${subregionValues}`);
    }
    if (institutionTypeValues) {
      searchParams.push(`institutionTypes=${institutionTypeValues}`);
    }
    console.log(searchParams.join("&"));
    if (tabIndex === 0) {
      setFilterParamsCountry(searchParams.join("&"));
      setPageParamsCountry("page=0");
    } else {
      setFilterParamsInstitution(searchParams.join("&"));
      setPageParamsInstitution("page=0");
    }
  });

  const onReset = () => {
    if (tabIndex === 0) {
      setFilterParamsCountry("");
    } else {
      setFilterParamsInstitution("");
    }
    setCheckedSubregions(subregions);
    reset();
  };

  return (
    <form onSubmit={onSubmit} onReset={onReset}>
      <Box borderRadius="md" boxShadow={{ base: "none", md: "md" }} overflow={"hidden"}>
        <HStack bg="brand.500" justifyContent="center" spacing="10px" height="60px">
          <Box>
            <Icon icon="filter" color="white" size={24} />
          </Box>
          <Text fontWeight="900" fontSize="12px" textTransform="uppercase" color="white">
            Filters
          </Text>
        </HStack>

        <Accordion defaultIndex={[0]} allowMultiple variant="tableFilter">
          {tabIndex === 1 ? <FilterAccordionItem name={"Institution Type"} form={institutionTypeForm(control)} /> : ""}
          <FilterAccordionItem
            name={"Region"}
            form={regionForm(control, checkedSubregions, setCheckedSubregions, setValue)}
          />
          <FilterAccordionItem
            name={"Subregion"}
            form={subregionForm(control, checkedSubregions, setCheckedSubregions, setValue)}
          />
          <FilterAccordionItem name={"Publication Count / Open Access"} form={statsForm(control)} />
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
