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

import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControlProps,
  HStack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import Icon from "./Icon";
import CountryForm, { CustomItem } from "./CountryForm";
import InstitutionTypeForm from "./InstitutionTypeForm";
import RegionForm from "./RegionForm";
import SubregionForm, { subregions } from "./SubregionForm";
import StatsForm, { sliderValues } from "./StatsForm";

export const transformFormResults = (formResults: { [x: string]: boolean }) => {
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
          <AccordionPanel pb={4} bg="#F9FAFA" borderTopWidth={"1px"}>
            {isExpanded ? form : ""}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

export interface IFormInputs {
  subregion: string;
  country: string[];
  institutionType: { string: boolean };
  n_outputs: number[];
  n_outputs_open: number[];
  p_outputs_open: number[];
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
}: TableFilterProps) => {
  const { handleSubmit, control, setValue, reset } = useForm<IFormInputs>();
  const [checkedSubregionsCountry, setCheckedSubregionsCountry] = React.useState(subregions);
  const [checkedSubregionsInstitution, setCheckedSubregionsInstitution] = React.useState(subregions);
  const [selectedCountriesCountry, setSelectedCountriesCountry] = React.useState<CustomItem[]>([]);
  const [selectedCountriesInstitution, setSelectedCountriesInstitution] = React.useState<CustomItem[]>([]);
  const defaultSliderValuesCountry: sliderValues = {
    n_outputs: [0, 100],
    n_outputs_open: [0, 100],
    p_outputs_open: [0, 100],
  };
  const [sliderValuesCountry, setSliderValuesCountry] = React.useState<sliderValues>(defaultSliderValuesCountry);
  const defaultSliderValuesInstitution: sliderValues = {
    n_outputs: [0, 100],
    n_outputs_open: [0, 100],
    p_outputs_open: [0, 100],
  };
  const [sliderValuesInstitution, setSliderValuesInstitution] =
    React.useState<sliderValues>(defaultSliderValuesInstitution);

  const checkedSubregions = tabIndex === 0 ? checkedSubregionsCountry : checkedSubregionsInstitution;
  const setCheckedSubregions = tabIndex === 0 ? setCheckedSubregionsCountry : setCheckedSubregionsInstitution;
  const selectedCountries = tabIndex === 0 ? selectedCountriesCountry : selectedCountriesInstitution;
  const setSelectedCountries = tabIndex === 0 ? setSelectedCountriesCountry : setSelectedCountriesInstitution;
  const sliderValues = tabIndex === 0 ? sliderValuesCountry : sliderValuesInstitution;
  const setSliderValues = tabIndex === 0 ? setSliderValuesCountry : setSliderValuesInstitution;

  const onSubmit = handleSubmit((data: IFormInputs) => {
    const countryValues = data.country === undefined ? "" : data.country.toString();
    const institutionTypeValues = transformFormResults(data.institutionType);
    const totalOutputs = data.n_outputs;
    // const totalOutputsOpen = data.n_outputs_open;
    const percentOutputsOpen = data.p_outputs_open;
    console.log(data);
    const searchParams = [];
    if (data.subregion) {
      searchParams.push(`subregions=${data.subregion}`);
    }
    if (countryValues) {
      searchParams.push(`countries=${countryValues}`);
    }
    if (institutionTypeValues) {
      searchParams.push(`institutionTypes=${institutionTypeValues}`);
    }
    if (totalOutputs) {
      searchParams.push(`minNOutputs=${totalOutputs[0]}&maxNOutputs=${totalOutputs[1]}`);
    }
    //TODO add when available with API
    // if (totalOutputsOpen) {
    //   searchParams.push(``)
    // }
    if (percentOutputsOpen) {
      searchParams.push(`minPOutputsOpen=${percentOutputsOpen[0]}&maxPOutputsOpen=${percentOutputsOpen[1]}`);
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
      setSliderValues(defaultSliderValuesCountry);
    } else {
      setFilterParamsInstitution("");
      setSliderValues(defaultSliderValuesInstitution);
    }
    setCheckedSubregions(subregions);
    setSelectedCountries([]);
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
          <FilterAccordionItem
            name={"Region"}
            form={RegionForm(control, checkedSubregions, setCheckedSubregions, setValue, onSubmit)}
          />
          <FilterAccordionItem
            name={"Subregion"}
            form={SubregionForm(control, checkedSubregions, setCheckedSubregions, setValue, onSubmit)}
          />
          <FilterAccordionItem name={"Country"} form={CountryForm(control, selectedCountries, setSelectedCountries)} />
          <FilterAccordionItem
            name={"Publication Count / Open Access"}
            form={StatsForm(control, sliderValues, setSliderValues, onSubmit)}
          />
          {tabIndex === 1 ? <FilterAccordionItem name={"Institution Type"} form={InstitutionTypeForm(control)} /> : ""}
        </Accordion>

        <HStack justifyContent="space-around" m={{ base: "none", md: "10px 0px" }}>
          <Button variant="tableFilter" type="reset">
            <Text>Clear Filters</Text>
          </Button>

          <Button variant="tableFilter" type="submit">
            <Text>Apply Filters</Text>
          </Button>
        </HStack>
      </Box>
    </form>
  );
};

export default TableFilter;
