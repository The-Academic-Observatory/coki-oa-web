// Copyright 2022-2024 Curtin University
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
// Author: Aniek Roelofs, James Diprose, Alex Massen-Hane

import { CheckboxTree, EntityAutocomplete, Icon } from "@/components/common";
import { NODES } from "@/components/dashboard/Dashboard";
import { FilterAccordionItem, InstitutionTypeForm, OpenAccessForm } from "@/components/filter";
import { useEffectAfterRender } from "@/lib/hooks";
import { Dict, EntityStats } from "@/lib/model";
import { CloseIcon } from "@chakra-ui/icons";
import { Accordion, Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { Form, FormikProvider, useFormik } from "formik";
import lodashIsEqual from "lodash.isequal";
import lodashOmit from "lodash.omit";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

const filterMaxWidth = 300;
const plurals: { [key: string]: string } = { country: "countries", institution: "institutions" };

export interface PageForm {
  page: number;
  limit: number;
  orderBy: string;
  orderDir: string;
}

export interface OpenAccess {
  minPOutputsOpen: number;
  maxPOutputsOpen: number;
  minNOutputs: number;
  maxNOutputs: number;
  minNOutputsOpen: number;
  maxNOutputsOpen: number;
}

export interface SelectOption {
  value: string;
  label: string;
  image: string;
}

export interface QueryForm extends Dict {
  page: PageForm;
  ids: Array<SelectOption>;
  countries: Array<SelectOption>;
  region: {
    [key: string]: {
      value: boolean;
      subregion: {
        [key: string]: {
          value: boolean;
        };
      };
    };
  };
  institutionType: { [key: string]: boolean };
  openAccess: OpenAccess;
}

interface FilterFormProps {
  entityType: string;
  platform: string;
  queryForm: QueryForm;
  setQueryForm: (q: QueryForm) => void;
  defaultQueryForm: QueryForm;
  entityStats: EntityStats;
  resetFormState: number;
  rangeSliderMinMaxValues: OpenAccess;
  onClose?: () => void;
  title?: string;
}

function toggleIndex(accordionItemIndex: number, index: Array<number>) {
  const i = index.indexOf(accordionItemIndex);
  if (i < 0) {
    index.push(accordionItemIndex);
  } else {
    delete index[i];
  }
}

function removeIndex(accordionItemIndex: number, index: Array<number>) {
  const i = index.indexOf(accordionItemIndex);
  if (i >= 0) {
    delete index[i];
  }
}

function makeFilterFormAccordionItemIndex(accordionItemIndex: number, idsIndex: number, index: Array<number>) {
  let newIndex = [...index];
  toggleIndex(accordionItemIndex, newIndex);
  removeIndex(idsIndex, newIndex);
  return newIndex;
}

const FilterForm = ({
  entityType,
  platform,
  queryForm,
  setQueryForm,
  defaultQueryForm,
  entityStats,
  resetFormState,
  rangeSliderMinMaxValues,
  onClose,
  title,
}: FilterFormProps) => {
  // Create formik form
  const onSubmit = useCallback(
    (values: QueryForm) => {
      // Only set page to 1 but don't change sort order
      const q = {
        ...values,
        page: { ...values.page, page: 0 },
      };

      // Set query form state
      setQueryForm(q);

      // Close modal if exists
      if (onClose !== undefined) {
        onClose();
      }
    },
    [onClose, setQueryForm],
  );

  // TODO: somehow causing FilterForm to re-render 3 times on any change
  const formik = useFormik<QueryForm>({
    enableReinitialize: true, // enabled so that when queryForm is reset externally, or the values change externally, the form updates
    initialValues: queryForm,
    onSubmit: onSubmit,
    validateOnChange: false, // this and validationOnBlur are to improve performance for the forms. Works the same as before.
    validateOnBlur: false,
  });

  const onReset = useCallback(() => {
    // Set all fields to not be touched
    formik.resetForm({
      values: {
        ...defaultQueryForm,
      },
    });

    // Submit form
    formik.handleSubmit();
  }, [defaultQueryForm, formik]);

  // Watch for external calls to reset the form
  useEffectAfterRender(onReset, [resetFormState]);

  // Check if form dirty
  const isDirty = useMemo((): boolean => {
    return !lodashIsEqual(formik.values, defaultQueryForm);
  }, [formik.values, defaultQueryForm]);

  // Check if different sub parts of the form are dirty
  const isRegionDirty = useMemo((): boolean => {
    return !lodashIsEqual(formik.values.region, defaultQueryForm.region);
  }, [formik.values.region, defaultQueryForm.region]);
  const isOpenAccessDirty = useMemo((): boolean => {
    return !lodashIsEqual(formik.values.openAccess, defaultQueryForm.openAccess);
  }, [formik.values.openAccess, defaultQueryForm.openAccess]);
  const isInstitutionTypeDirty = useMemo((): boolean => {
    return !lodashIsEqual(formik.values.institutionType, defaultQueryForm.institutionType);
  }, [formik.values.institutionType, defaultQueryForm.institutionType]);
  const isCountriesDirty = useMemo((): boolean => {
    return !lodashIsEqual(formik.values.countries, defaultQueryForm.countries);
  }, [formik.values.countries, defaultQueryForm.countries]);
  const isIdsDirty = useMemo((): boolean => {
    return !lodashIsEqual(formik.values.ids, defaultQueryForm.ids);
  }, [formik.values.ids, defaultQueryForm.ids]);

  // Reset filters area of form when formik.values.ids are set
  useEffect(() => {
    if (formik.values.ids.length > 0) {
      for (const name of Object.keys(defaultQueryForm)) {
        if (name !== "ids" && !lodashIsEqual(formik.values[name], defaultQueryForm[name])) {
          formik.setFieldValue(name, defaultQueryForm[name]);
        }
      }
    }
  }, [defaultQueryForm, formik.values.ids]); // don't put formik in deps

  // Reset formik.values.ids when filters area of form are set
  useEffect(() => {
    const isFiltersFormDirty = !lodashIsEqual(
      lodashOmit(formik.values, ["ids"]),
      lodashOmit(defaultQueryForm, ["ids"]),
    );
    if (formik.values.ids.length > 0 && isFiltersFormDirty) {
      formik.setFieldValue("ids", []);
    }
  }, [
    defaultQueryForm,
    formik.values.region,
    formik.values.openAccess,
    formik.values.institutionType,
    formik.values.countries,
  ]); // don't put formik in deps

  // Accordion state
  // As far as I know there is no way to get the index of an AccordionItem, so we have to hard code them
  const defaultIndex = [0];
  const [index, setIndex] = useState(defaultIndex);
  const indexes = {
    country: {
      region: 0,
      openAccess: 1,
      ids: 2,
    },
    institution: {
      region: 0,
      countries: 1,
      openAccess: 2,
      institutionTypes: 3,
      ids: 4,
    },
  } as { [key: string]: { [key: string]: number } };

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit} data-test={`${platform}-${entityType}-form`}>
        <Box
          boxShadow={{ base: "none", md: "0px 2px 5px 2px rgba(0,0,0,0.05)" }}
          maxWidth={{ md: `${filterMaxWidth}px` }}
        >
          <HStack bg="brand.500" justifyContent="center" spacing="14px" height="60px" position="relative">
            <Box>
              <Icon icon="filter" color="white" size={24} />
            </Box>
            <Text fontWeight="900" fontSize={{ base: "18px", md: "12px" }} textTransform="uppercase" color="white">
              {title === undefined && "Filters"}
              {title !== undefined && title}
            </Text>

            <IconButton
              variant="icon"
              aria-label="Close Filters"
              position="absolute"
              right="3px"
              isRound
              icon={<CloseIcon fontSize="14px" />}
              color="grey.100"
              display={{ base: "flex", md: "none" }}
              onClick={onClose}
            />
          </HStack>

          {/* Only reset the form if it is dirty/used. */}
          <Accordion defaultIndex={defaultIndex} index={index} allowMultiple variant="filterForm">
            <FilterAccordionItem
              name="Region"
              isDirty={isRegionDirty}
              onClick={() => {
                const entityIndexes = indexes[entityType];
                const newIndex = makeFilterFormAccordionItemIndex(entityIndexes.region, entityIndexes.ids, index);
                setIndex(newIndex);
              }}
            >
              <CheckboxTree nodes={NODES} />
            </FilterAccordionItem>

            {entityType === "institution" ? (
              <FilterAccordionItem
                name="Country"
                data-test="institution-country-filter-accordion-item"
                isDirty={isCountriesDirty}
                onClick={() => {
                  const entityIndexes = indexes[entityType];
                  const newIndex = makeFilterFormAccordionItemIndex(entityIndexes.countries, entityIndexes.ids, index);
                  setIndex(newIndex);
                }}
              >
                <EntityAutocomplete
                  entityType="country"
                  formFieldName="countries"
                  data-test="institution-country-filter-autocomplete"
                  p="12px"
                />
              </FilterAccordionItem>
            ) : (
              ""
            )}

            <FilterAccordionItem
              name="Publications & OA"
              isDirty={isOpenAccessDirty}
              onClick={() => {
                const entityIndexes = indexes[entityType];
                const newIndex = makeFilterFormAccordionItemIndex(entityIndexes.openAccess, entityIndexes.ids, index);
                setIndex(newIndex);
              }}
            >
              <OpenAccessForm rangeSliderMinMaxValues={rangeSliderMinMaxValues} histograms={entityStats.histograms} />
            </FilterAccordionItem>

            {entityType === "institution" ? (
              <>
                <FilterAccordionItem
                  name="Institution Type"
                  isDirty={isInstitutionTypeDirty}
                  onClick={() => {
                    const entityIndexes = indexes[entityType];
                    const newIndex = makeFilterFormAccordionItemIndex(
                      entityIndexes.institutionTypes,
                      entityIndexes.ids,
                      index,
                    );
                    setIndex(newIndex);
                  }}
                >
                  <InstitutionTypeForm />
                </FilterAccordionItem>
              </>
            ) : (
              ""
            )}

            <FilterAccordionItem
              name={`Select ${plurals[entityType]}`}
              data-test={`select-${plurals[entityType]}-accordion-item`}
              isDirty={isIdsDirty}
              onClick={() => {
                const entityIndexes = indexes[entityType];
                let newIndex = [...index];
                const i = newIndex.indexOf(entityIndexes.ids);
                if (i < 0) {
                  newIndex = [entityIndexes.ids];
                } else {
                  delete newIndex[i];
                }
                setIndex(newIndex);
              }}
            >
              <EntityAutocomplete
                entityType={entityType}
                formFieldName="ids"
                p="12px"
                data-test={`select-${plurals[entityType]}-autocomplete`}
              />
            </FilterAccordionItem>
          </Accordion>

          <HStack justifyContent="space-around" p={{ base: "24px 0px", md: "14px 0px" }} bgColor="white">
            <Button variant="submit" type="submit">
              Apply
            </Button>

            <Button variant="submit" onClick={onReset} isDisabled={!isDirty}>
              Clear
            </Button>
          </HStack>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default memo(FilterForm);
