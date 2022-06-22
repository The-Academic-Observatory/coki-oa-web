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

import { Checkbox, SimpleGrid } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Controller } from "react-hook-form";

export const regions: { [x: string]: string[] } = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Latin America and the Caribbean", "Northern America"],
  Asia: ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
};
const RegionForm = (
  control: any,
  checkedSubregions: { [x: string]: boolean },
  setCheckedSubregions: any,
  setValue: any,
  onSubmit: any,
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
            defaultValue={true}
            render={({ field: { ref } }) => (
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
                  onSubmit();
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

export default RegionForm;
