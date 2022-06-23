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
import { subregions } from "./SubregionForm";
import { UseFormSetValue } from "react-hook-form";
import { IFormInputs } from "./TableFilter";

export const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"] as const;
export const regionToSubregion: Record<typeof regions[number], typeof subregions[number][]> = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Latin America and the Caribbean", "Northern America"],
  Asia: ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
};
const RegionForm = (
  checkedSubregions: Record<typeof subregions[number], boolean>,
  setCheckedSubregions: React.Dispatch<React.SetStateAction<typeof checkedSubregions>>,
  setValue: UseFormSetValue<IFormInputs>,
  onSubmit: { (e?: React.BaseSyntheticEvent): void },
) => {
  const isChecked = (region: typeof regions[number]) => {
    let subregion: typeof subregions[number];
    for (subregion of regionToSubregion[region]) {
      if (!checkedSubregions[subregion]) {
        return false;
      }
    }
    return true;
  };
  return (
    <SimpleGrid columns={2} spacing={3}>
      {regions.map((region): ReactElement => {
        return (
          <Checkbox
            key={region}
            variant="tableFilter"
            colorScheme="checkbox"
            isChecked={isChecked(region)}
            onChange={(e) => {
              const checkedSubregionsCopy = JSON.parse(JSON.stringify(checkedSubregions));
              let subregion: typeof subregions[number];
              for (subregion of regionToSubregion[region]) {
                checkedSubregionsCopy[subregion] = e.target.checked;
              }
              setCheckedSubregions(checkedSubregionsCopy);
              setValue("subregion", checkedSubregionsCopy);
              onSubmit();
            }}
          >
            {region}
          </Checkbox>
        );
      })}
    </SimpleGrid>
  );
};

export default RegionForm;
