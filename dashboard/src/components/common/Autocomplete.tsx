// Copyright 2023-2024 Curtin University
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

import { BrandBadge } from "@/components/common";
import { SelectOption } from "@/components/filter/FilterForm";
import { cokiImageLoader } from "@/lib/api";
import { Box, BoxProps } from "@chakra-ui/react";
import { AsyncSelect, chakraComponents, MultiValue, MultiValueProps, OptionProps } from "chakra-react-select";
import { useFormikContext } from "formik";
import React, { ReactNode } from "react";
import Dict = NodeJS.Dict;

interface AutocompleteProps extends BoxProps {
  placeholder: string;
  formFieldName: string;
  loadOptions: (inputValue: string, callback: any) => void;
  noOptionsMessage: string;
}

const customComponents = {
  // Remove the loading icon
  LoadingIndicator: () => null,
  // Option values that appear in the search results
  Option: (props: OptionProps<SelectOption>) => {
    return (
      <chakraComponents.Option {...props}>
        <BrandBadge name={props.children as string} imageSrc={cokiImageLoader(props.data.image)} maxWidth="100%" />
      </chakraComponents.Option>
    );
  },
  // Chips added to the select
  MultiValue: (props: MultiValueProps<SelectOption>) => {
    return (
      <chakraComponents.MultiValue {...props}>
        <BrandBadge name={props.children as string} imageSrc={cokiImageLoader(props.data.image)} maxWidth="100%" />
      </chakraComponents.MultiValue>
    );
  },
};

const Autocomplete = ({ placeholder, formFieldName, loadOptions, noOptionsMessage, ...rest }: AutocompleteProps) => {
  const { setFieldValue, handleChange, values } = useFormikContext<Dict<Array<SelectOption>>>();
  const formValues = values[formFieldName];

  return (
    <Box {...rest}>
      <AsyncSelect
        variant="outline"
        isMulti={true}
        placeholder={placeholder}
        closeMenuOnSelect={true}
        isClearable={false}
        value={formValues} // Formik to AsyncSelect
        onChange={(newValue: MultiValue<SelectOption>, actionMeta) => setFieldValue(formFieldName, newValue)} // AsyncSelect to Formik
        loadOptions={loadOptions}
        defaultOptions={true} // defaultOptions={true} makes AsyncSelect call loadOptions with '' to fetch the default options
        components={customComponents}
        noOptionsMessage={(obj: { inputValue: string }): ReactNode => {
          return <Box p="6px">{noOptionsMessage}</Box>;
        }}
        chakraStyles={{
          // The select box
          control: (provided) => ({
            ...provided,
            p: 0,
            borderColor: "grey.600",
            borderWidth: "1.5px",
            _hover: {
              borderColor: "brand.400",
              boxShadow: "none",
            },
            _focus: {
              borderColor: "brand.500",
              boxShadow: "none",
            },
          }),
          // Placeholder text
          placeholder: (provided) => ({
            ...provided,
            color: "grey.800",
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: "500",
          }),
          // The dropdown menu button with the down arrow
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "white",
            backgroundColor: "brand.500",
            p: "6px",
          }),
          // The container that surrounds the input.
          // When has no value, add more left and right padding so that the placeholder and input look OK.
          // When has value, reduce left and right padding, so that there is more space for tags / chips.
          valueContainer: (provided, state) => ({
            ...provided,
            p: state.hasValue ? "6px" : "6px 12px",
          }),
          // Makes the dropdown menu resize the parent container
          menu: (provided) => ({
            ...provided,
            position: "relative",
          }),
          // Removes top and bottom padding on menu list
          menuList: (provided) => ({
            ...provided,
            p: 0,
            overflowX: "hidden",
            overflowY: "auto",
          }),
          // Menu item / option list item
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#f0f0f0" : "white",
            fontSize: "10px",
            textTransform: "uppercase",
          }),
          // Individual chip within input box
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#f0f0f0",
            fontSize: "10px",
            textTransform: "uppercase",
          }),
          noOptionsMessage: (provided) => ({
            ...provided,
            fontSize: "16px",
            fontWeight: 500,
          }),
          loadingMessage: (provided) => ({
            ...provided,
            fontSize: "16px",
            fontWeight: 500,
          }),
        }}
      />
    </Box>
  );
};

export default Autocomplete;
