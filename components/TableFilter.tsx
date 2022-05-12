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
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormControlProps,
  HStack,
  Stack,
  Image,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import Icon from "./Icon";
import { AddIcon, CloseIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useForm, Controller } from "react-hook-form";
import InstitutionTypeForm from "./InstitutionTypeForm";
import RegionForm from "./RegionForm";
import { SubregionForm, subregions } from "./SubregionForm";
import StatsForm from "./StatsForm";
import { CUIAutoComplete, Item } from "chakra-ui-autocomplete";

interface CustomItem extends Item {
  logo: string;
}

const customRender = (item: CustomItem) => {
  return (
    <HStack my="1px">
      <Image rounded="full" objectFit="cover" boxSize="16px" src={item.logo} alt={item.label} />
      <Text textStyle="tableCell">{item.label}</Text>
    </HStack>
  );
};

const CountryForm = (control: any, selectedCountries: CustomItem[], setSelectedCountries: any) => {
  React.useEffect(() => {
    fetch("/data/country.json")
      .then((res) => res.json())
      .then((data) => {
        const countries = data.map((country: { name: string; logo_s: string }) => {
          return { value: country.name, label: country.name, logo: country.logo_s };
        });
        countries.sort((a: Item, b: Item) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0));
        setPickerItems(countries);
      });
  }, []);

  const [pickerItems, setPickerItems] = React.useState<CustomItem[]>([]);
  // const [selectedItems, setSelectedItems] = React.useState<CustomItem[]>([]);

  const handleCreateItem = (item: CustomItem) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedCountries((curr: CustomItem[]) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: CustomItem[]) => {
    if (selectedItems) {
      setSelectedCountries(selectedItems);
    }
  };

  return (
    <FormControl>
      <Box id={"country-dropdown"}>
        <Controller
          control={control}
          name={`country`}
          defaultValue={false}
          render={({ field: { onChange, value, ref } }) => (
            <CUIAutoComplete
              label=""
              placeholder="Type a Country"
              onCreateItem={handleCreateItem}
              items={pickerItems}
              itemRenderer={customRender}
              hideToggleButton
              tagStyleProps={{
                mb: "50",
                textStyle: "tableCell",
                fontSize: "13px",
              }}
              listStyleProps={{
                maxHeight: "200px",
                overflowY: "scroll",
              }}
              selectedIconProps={{ icon: "CheckCircleIcon", height: 3 }}
              selectedItems={selectedCountries}
              onSelectedItemsChange={(changes) => {
                handleSelectedItemsChange(changes.selectedItems);
                let countries: string[] = [];
                if (changes.selectedItems !== undefined) {
                  countries = changes.selectedItems.map((country) => {
                    return encodeURIComponent(country.value);
                  });
                }
                onChange(countries);
              }}
            />
          )}
        />
      </Box>
    </FormControl>
  );
};

export const transformFormResults = (formResults: { [x: string]: any }) => {
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
          <AccordionPanel pb={4} bg="#F9FAFA">
            {isExpanded ? form : ""}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

interface IFormInputs {
  region: any;
  subregion: any;
  country: any;
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
  const [selectedCountriesCountry, setSelectedCountriesCountry] = React.useState<CustomItem[]>([]);
  const [selectedCountriesInstitution, setSelectedCountriesInstitution] = React.useState<CustomItem[]>([]);

  const checkedSubregions = tabIndex === 0 ? checkedSubregionsCountry : checkedSubregionsInstitution;
  const setCheckedSubregions = tabIndex === 0 ? setCheckedSubregionsCountry : setCheckedSubregionsInstitution;
  const selectedCountries = tabIndex === 0 ? selectedCountriesCountry : selectedCountriesInstitution;
  const setSelectedCountries = tabIndex === 0 ? setSelectedCountriesCountry : setSelectedCountriesInstitution;

  const onSubmit = handleSubmit((data: IFormInputs) => {
    const countryValues = data.country === undefined ? "" : data.country.toString();
    const institutionTypeValues = transformFormResults(data.institutionType);
    // console.log(data, data.region, subregionValues, countryValues, institutionTypeValues);
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
          <FilterAccordionItem name={"Publication Count / Open Access"} form={StatsForm(control)} />
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
