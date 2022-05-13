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

import { Box, FormControl, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { CUIAutoComplete, Item } from "chakra-ui-autocomplete";
import { Control, Controller } from "react-hook-form";
import { IFormInputs } from "./TableFilter";

export interface CustomItem extends Item {
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

const CountryForm = (
  control: Control<IFormInputs>,
  selectedCountries: CustomItem[],
  setSelectedCountries: { (value: React.SetStateAction<CustomItem[]>): void },
) => {
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
          // defaultValue={false}
          render={({ field: { onChange } }) => (
            <CUIAutoComplete
              label=""
              placeholder="Type a Country"
              onCreateItem={handleCreateItem}
              items={pickerItems}
              itemRenderer={customRender}
              hideToggleButton
              tagStyleProps={{
                marginBottom: "5px !important",
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

export default CountryForm;
