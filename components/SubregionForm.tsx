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
import { Checkbox, FormControl, Stack } from "@chakra-ui/react";
import { useForm, Controller, ChangeHandler } from "react-hook-form";
import { transformFormResults } from "./TableFilter";

export const subregions = {
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

const SubregionForm = (
  control: any,
  checkedSubregions: { [x: string]: boolean },
  setCheckedSubregions: any,
  setValue: any,
  onSubmit: any,
) => {
  return (
    <FormControl>
      <Stack maxHeight="300px" overflowY={"scroll"}>
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
                    setCheckedSubregions(checkedSubregionsCopy); // update subregions, changing checkboxes
                    setValue("subregion", transformFormResults(checkedSubregionsCopy)); // update underlying data
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
      </Stack>
    </FormControl>
  );
};

export default SubregionForm;
