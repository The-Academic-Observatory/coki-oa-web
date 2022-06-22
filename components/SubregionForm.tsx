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
import { Checkbox, FormControl, Stack, StackDivider } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { regions } from "./RegionForm";

export const subregions = {
  "Australia and New Zealand": true,
  "Central Asia": true,
  "Eastern Asia": true,
  "Eastern Europe": true,
  "Latin America and the Caribbean": true,
  Melanesia: true,
  Micronesia: true,
  "Northern Africa": true,
  "Northern America": true,
  "Northern Europe": true,
  Polynesia: true,
  "South-eastern Asia": true,
  "Southern Asia": true,
  "Southern Europe": true,
  "Sub-Saharan Africa": true,
  "Western Asia": true,
  "Western Europe": true,
};

const SubregionForm = (
  control: any,
  checkedSubregions: { [x: string]: boolean },
  setCheckedSubregions: any,
  setValue: any,
  onSubmit: any,
) => {
  return (
    <FormControl>
      <Stack maxHeight="300px" overflowY={"scroll"} divider={<StackDivider borderColor="gray.200" />}>
        {Object.keys(regions).map((region): JSX.Element[] => {
          return [
            <Stack key={"subregions"}>
              {regions[region].map((subregion): ReactElement => {
                return (
                  <Controller
                    control={control}
                    name={`subregion.${subregion}`}
                    key={subregion}
                    defaultValue={true}
                    render={({ field: { onChange, value, ref } }) => (
                      <Checkbox
                        key={subregion}
                        variant="tableFilter"
                        colorScheme="checkbox"
                        isChecked={checkedSubregions[subregion]}
                        onChange={(e) => {
                          const checkedSubregionsCopy = JSON.parse(JSON.stringify(checkedSubregions));
                          checkedSubregionsCopy[subregion] = e.target.checked;
                          setCheckedSubregions(checkedSubregionsCopy); // update subregions, changing checkboxes
                          setValue("subregion", checkedSubregionsCopy); // update underlying data
                          onSubmit(); // submit changes
                        }}
                        ref={ref}
                      >
                        {subregion}
                      </Checkbox>
                    )}
                  />
                );
              })}
            </Stack>,
          ];
        })}
      </Stack>
    </FormControl>
  );
};

export default SubregionForm;
