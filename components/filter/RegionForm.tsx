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
// Author: Aniek Roelofs, James Diprose

import { Field, useField, useFormikContext } from "formik";
import { Checkbox, Stack, StackDivider } from "@chakra-ui/react";
import React, { memo, useCallback } from "react";

export const regions: { [key: string]: Array<string> } = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Latin America and the Caribbean", "Northern America"],
  Asia: ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
};

export interface RegionCheckboxProps {
  region: string;
}

const RegionCheckbox = ({ region }: RegionCheckboxProps) => {
  const { setFieldValue, handleChange } = useFormikContext();
  const key = `region.${region}`;
  const [field, meta] = useField(key);
  const { value } = meta;
  const onChange = useCallback((e: React.ChangeEvent<any>) => {
    // TODO: causes multiple re-renders to filter form as multiple fields changed at different times

    // Handle change in formik
    handleChange(e);

    // Update subregions based on which region was selected
    for (let subregion of regions[region]) {
      const id = `subregion.${subregion}`;
      setFieldValue(id, e.target.checked); // Update the subregion checkbox value
    }
  }, []);

  return (
    <Field as={Checkbox} {...field} isChecked={value} variant="filterForm" colorScheme="checkbox" onChange={onChange}>
      {region}
    </Field>
  );
};

const RegionForm = () => {
  return (
    <Stack p="18px 24px" spacing="8px" divider={<StackDivider borderColor="gray.200" />}>
      {Object.keys(regions).map((region) => {
        return <RegionCheckbox key={region} region={region} />;
      })}
    </Stack>
  );
};

export default memo(RegionForm);
