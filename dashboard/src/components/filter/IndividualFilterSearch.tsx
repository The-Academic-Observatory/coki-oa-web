// Copyright 2023 Curtin University
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
// Author: Alex Massen-Hane, Jamie Diprose

import { QueryForm } from "@/components/filter";
import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { OADataAPI } from "@/lib/api";
import { QueryParams } from "@/lib/model";
import { useFormikContext } from "formik";
import { AsyncSelect } from "chakra-react-select";
import { ActionMeta, MultiValue } from "chakra-react-select";
import { cokiImageLoader } from "@/lib/api";
import { HStack, Image, Text } from "@chakra-ui/react";

export interface SelectOption {
  value: string;
  label: string;
  image: string;
  countryCode?: string;
}

interface IndividualFilterSearchProps {
  category: string;
  filterByCountryCode?: boolean;
}

export function clearSelectedOptions() {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<SelectOption>>();
  console.log(selectedOptions);
  setSelectedOptions([]);
  console.log(selectedOptions);
}
async function getEntities(searchText: string, category: string) {
  let resultLimit = 10;
  const client = new OADataAPI();
  if (searchText.length > 1) {
    const search = await client.searchEntities(searchText.toLowerCase(), 0, resultLimit, null, category);
    return search.data.items;
  } else {
    // Return a list of entities that the defaults for the dropdown list
    const query: QueryParams = {
      page: 0,
      limit: resultLimit,
      // orderBy: "name",
      orderBy: "p_outputs_open",
      orderDir: "dsc",
    };
    const defaultEntities = await client.getEntities(category, query);
    return defaultEntities.items;
  }
}

const IndividualFilterSearchAsync = ({ category, filterByCountryCode }: IndividualFilterSearchProps) => {
  // TODO:
  // - Make the clear button to remove the selectedOptions state. I couldn't get the context to work and have it set as a variable thats passed down, and as a react states it was always
  //   lagging one render behind and didn't actually change what was rendered in the multi-select search box. :/
  // - Make all the panels above the "Select Individual {category}" to close when the select individual panel is opened. - Tried doing with it forceOpenClose, but needs to be a trigger, not a blanket boolean.
  // - Sometimes searching on an institution's name crashes the API - It tries to do all the searches for each keystroke first and then the final when you've selected it from the dropdown.
  //   Is speed of SQL a searching going to be a problem on prod?

  const { setFieldValue, handleChange, values } = useFormikContext<QueryForm>();
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<SelectOption>>();
  const [defaultOptions, setDefaultOptions] = useState<MultiValue<SelectOption>>();

  const SetFieldWithOptions = (newValue: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
    setFieldValue("ids", null);
    setFieldValue("countries", null);

    // Set state of the options for filtering the selected options.
    if (newValue != undefined) {
      setSelectedOptions(newValue);
    }

    // For each option selected, set that field in Formik to true.
    for (let option of newValue) {
      if (filterByCountryCode) {
        setFieldValue(`countries.${option.value}`, true);
      } else {
        setFieldValue(`ids.${option.value}`, true);
      }
    }
  };

  const promiseOptions = async (inputValue: string, callback: any) => {
    if (!inputValue) {
      return callback(null);
    }
    return new Promise<SelectOption[]>((resolve) => {
      var data: Promise<Array<SelectOption> | undefined> = selectOptions(inputValue, category);
      resolve(data); // Type of this variable is not correct here
    });
  };

  async function selectOptions(searchText: string, category: string) {
    const entites = await getEntities(searchText, category);
    var options: SelectOption[] = [];
    if (entites != null) {
      for (let entity of entites) {
        let option: SelectOption = { value: entity.id, label: entity.name.toUpperCase(), image: entity.logo_sm };

        // If it is an entity with a country_code (an institution)
        if (entity.country_code) {
          option.countryCode = entity.country_code;
        }

        // Only add an option to the list if it isn't already selected
        // There is probably a better way of doing this
        if (selectedOptions != undefined) {
          if (!selectedOptions.some((x) => x.value === option.value)) {
            options.push(option);
          }
        } else {
          options.push(option);
        }
      }
    }
    if (!searchText) {
      setDefaultOptions(options);
    } else {
      return options;
    }
  }

  // Remove the loading icon
  const asyncComponents = {
    LoadingIndicator: () => null,
  };

  return (
    <Box data-test="asyncAutoSelectBox" pb="15px" pr="15px" pl="15px" pt="15px">
      <AsyncSelect
        isMulti={true}
        placeholder={"Search"}
        closeMenuOnSelect={false}
        components={asyncComponents}
        // Needing to set the CSS here as this component does not do varients.
        chakraStyles={{
          placeholder: (provided) => ({
            ...provided,
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: "500",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            backgroundColor: "brand.400",
            width: "40px",
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            display: "none",
          }),
          menuList: (provided) => ({
            ...provided,
            backgroundColor: "white",
            borderRadius: "10px",
            position: "relative",
          }),
          menu: (provided) => ({
            ...provided,
            fontSize: "12px",
            position: "relative",
          }),
          control: (provided) => ({
            ...provided,
            // height: "5px",
            borderRadius: "10px",
            borderColor: "white",
            borderWidth: "1.5px",
            backgroundColor: "white",
            _focusVisible: null,
            _focus: {
              borderColor: "brand.400",
            },
          }),
          input: (provided) => ({
            ...provided,
            textTransform: "uppercase",
            textWrap: "nowrap",
            fontSize: "12px",
            hover: "grey.900",
          }),
          option: (provided, { data, isDisabled, isFocused, isSelected }) => ({
            ...provided,
            textTransform: "uppercase",
            fontSize: "12px",
            backgroundColor: "white",
          }),
          multiValue: (provided) => ({
            ...provided,
            borderRadius: "30px",
            backgroundColor: "white",
            textTransform: "uppercase",
            fontSize: "12px",
            // r: "40px",
          }),
          noOptionsMessage: (provided) => ({
            textTransform: "uppercase",
            ...provided,
            fontSize: "12px",
            backgroundColor: "white",
          }),
          loadingMessage: (provided) => ({
            textTransform: "uppercase",
            ...provided,
            fontSize: "12px",
          }),
        }}
        isClearable={false}
        onFocus={() => selectOptions("", category)}
        defaultOptions={defaultOptions}
        onChange={SetFieldWithOptions}
        loadOptions={promiseOptions}
        formatOptionLabel={(option) => (
          // Add the entity logo to the options.
          <HStack id={option.value} mr="30px">
            <Image rounded="full" objectFit="cover" boxSize="16px" src={cokiImageLoader(option.image)} />
            <Text textStyle="tableCell" flex="1">
              {option.label}
            </Text>
          </HStack>
        )}
      />
    </Box>
  );
};

export default IndividualFilterSearchAsync;
