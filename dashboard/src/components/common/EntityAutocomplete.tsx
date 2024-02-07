// Copyright 2023-2024 Curtin University
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
// Author: Alex Massen-Hane, Jamie Diprose

import { Autocomplete } from "@/components/common";
import { SelectOption } from "@/components/filter/FilterForm";
import { OADataAPI } from "@/lib/api";
import { Entity, QueryParams } from "@/lib/model";
import { BoxProps } from "@chakra-ui/react";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef } from "react";
import Dict = NodeJS.Dict;

const page = 0;
const limit = 50;
const filterIndexGetEntities: Dict<QueryParams> = {
  country: { page: 0, limit: limit, orderBy: "name", orderDir: "asc", minNOutputs: 50000 },
  institution: {
    page: 0,
    limit: limit,
    orderBy: "name",
    orderDir: "asc",
    minNOutputs: 100000,
    institutionTypes: ["Education"],
  },
};
const searchDebounce: number = 300;
const entityPluralIndex: Dict<string> = {
  country: "countries",
  institution: "institutions",
};

interface EntityAutocompleteProps extends BoxProps {
  entityType: string;
  formFieldName: string;
}

function entitiesToOptions(entities: Array<Entity>): Array<SelectOption> {
  return entities.map((entity) => {
    return { value: entity.id, label: entity.name, image: entity.logo_sm };
  });
}

const EntityAutocomplete = ({ entityType, formFieldName, ...rest }: EntityAutocompleteProps) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Callback that loads options when the user types into the Chakra React Select
  const loadOptions = useCallback(
    debounce((query, callback) => {
      // Abort existing query if running and create new AbortController
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const client = new OADataAPI();
      if (query === "") {
        // Default options search
        client
          .getEntities(entityType, filterIndexGetEntities[entityType] as QueryParams, abortControllerRef.current)
          .then((response) => {
            callback(entitiesToOptions(response.data.items));
          });
      } else {
        // Text search
        client.searchEntities(query, entityType, page, limit, abortControllerRef.current).then((response) => {
          callback(entitiesToOptions(response.data.items));
        });
      }
    }, searchDebounce),
    [searchDebounce],
  );

  // Abort if component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const plural = entityPluralIndex[entityType];
  return (
    <Autocomplete
      placeholder={`Search ${plural}`}
      formFieldName={formFieldName}
      loadOptions={loadOptions}
      noOptionsMessage={`No ${plural} found, check your spelling or try different keywords`}
      {...rest}
    />
  );
};

export default EntityAutocomplete;
