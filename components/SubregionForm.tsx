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
import { Controller, UseFormSetValue } from "react-hook-form";
import { regions, regionToSubregion } from "./RegionForm";
import { Control } from "react-hook-form/dist/types/form";
import { IFormInputs } from "./TableFilter";

export const subregions = [
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
] as const;
const SubregionForm = (
  control: Control<IFormInputs>,
  checkedSubregions: Record<typeof subregions[number], boolean>,
  setCheckedSubregions: React.Dispatch<React.SetStateAction<typeof checkedSubregions>>,
  setValue: UseFormSetValue<IFormInputs>,
  onSubmit: { (e?: React.BaseSyntheticEvent): void },
) => {
  return (
    <FormControl>
      <Stack maxHeight="300px" overflowY={"scroll"} divider={<StackDivider borderColor="gray.200" />}>
        {regions.map((region): JSX.Element[] => {
          return [
            <Stack key={"subregions"}>
              {regionToSubregion[region].map((subregion): ReactElement => {
                return (
                  <Controller
                    control={control}
                    name={`subregion.${subregion}`}
                    key={subregion}
                    defaultValue={true}
                    render={({ field: { ref } }) => (
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
