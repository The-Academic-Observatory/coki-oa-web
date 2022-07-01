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

import React, { memo, ReactElement } from "react";
import { Checkbox, Stack, StackDivider } from "@chakra-ui/react";
import { regions } from "./RegionForm";
import { Field, useField, useFormikContext } from "formik";
import { QueryForm } from "./FilterForm";

interface SubregionCheckboxProps {
  region: string;
  subregion: string;
}

const SubregionCheckbox = ({ region, subregion }: SubregionCheckboxProps) => {
  const { setFieldValue, values, handleChange } = useFormikContext<QueryForm>();
  const key = `subregion.${subregion}`;
  const [field, meta] = useField(key);
  const { value } = meta;

  return (
    <Field
      as={Checkbox}
      {...field}
      isChecked={value}
      variant="filterForm"
      colorScheme="checkbox"
      onChange={async (e: React.ChangeEvent<any>) => {
        //  TODO: causes multiple re-renders as two values changed at different times

        // Handle change in formik
        handleChange(e);

        // Update region: if all subregions are selected then check region, else uncheck
        // Use target value for current region as it is not yet updated in the form state
        const subregions = regions[region];
        const isRegionChecked = subregions
          .map((s) => {
            if (subregion === s) {
              return e.target.checked;
            }
            return values.subregion[s];
          })
          .every((s) => s === true);
        setFieldValue(`region.${region}`, isRegionChecked);
      }}
    >
      {subregion}
    </Field>
  );
};

const SubregionForm = () => {
  return (
    <Stack p="18px 24px" spacing="12px" divider={<StackDivider borderColor="gray.200" />}>
      {Object.keys(regions).map(function (region) {
        return [
          <Stack key="subregions">
            {regions[region].map((subregion): ReactElement => {
              return <SubregionCheckbox key={subregion} region={region} subregion={subregion} />;
            })}
          </Stack>,
        ];
      })}
    </Stack>
  );
};

export default memo(SubregionForm);
