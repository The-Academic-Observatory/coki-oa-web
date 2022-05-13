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

const institutionTypes = [
  "Archive",
  "Company",
  "Education",
  "Facility",
  "Government",
  "Healthcare",
  "Nonprofit",
  "Other",
];
const InstitutionTypeForm = (control: any) => {
  return (
    <SimpleGrid spacing={3} minChildWidth={"110px"}>
      {institutionTypes.map((institutionType): ReactElement => {
        return (
          <Controller
            control={control}
            name={`institutionType.${institutionType}`}
            key={institutionType}
            defaultValue={false}
            render={({ field: { onChange, value, ref } }) => (
              <Checkbox variant="tableFilter" colorScheme="checkbox" isChecked={!!value} onChange={onChange} ref={ref}>
                {institutionType}
              </Checkbox>
            )}
          />
        );
      })}
    </SimpleGrid>
  );
};

export default InstitutionTypeForm;
