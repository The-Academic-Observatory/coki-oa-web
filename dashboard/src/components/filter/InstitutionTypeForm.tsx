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
import { Field, useField } from "formik";

export const institutionTypes = [
  "Archive",
  "Company",
  "Education",
  "Facility",
  "Government",
  "Healthcare",
  "Nonprofit",
  "Other",
];

export interface InstitutionTypeCheckboxProps {
  name: string;
}

const InstitutionTypeCheckbox = ({ name }: InstitutionTypeCheckboxProps) => {
  const key = `institutionType.${name}`;
  const [field, meta] = useField(key);
  const { value } = meta;

  return (
    <Field as={Checkbox} {...field} isChecked={value} variant="filterForm" colorScheme="checkbox">
      {name}
    </Field>
  );
};

const InstitutionTypeForm = () => {
  return (
    <Stack p="18px 24px" spacing="8px" divider={<StackDivider borderColor="gray.200" />}>
      {institutionTypes.map((institutionType): ReactElement => {
        return <InstitutionTypeCheckbox key={institutionType} name={institutionType} />;
      })}
    </Stack>
  );
};

export default memo(InstitutionTypeForm);
