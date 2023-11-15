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
// Author: Aniek Roelofs, James Diprose, Alex Massen-Hane

import { CheckboxTree, Icon } from "@/components/common";
import { FilterAccordionItem, InstitutionTypeForm, OpenAccessForm } from "@/components/filter";
import { useEffectAfterRender } from "@/lib/hooks";
import { EntityStats } from "@/lib/model";
import { CloseIcon } from "@chakra-ui/icons";
import { Accordion, Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { Form, FormikProvider, useFormik } from "formik";
import lodashIsEqual from "lodash.isequal";
import React, { memo, useCallback } from "react";

const filterMaxWidth = 300;

// Old Regions array still needs to be used for Formik and creating the QueryForm.
export const regions: { [key: string]: Array<string> } = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Latin America and the Caribbean", "Northern America"],
  Asia: ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
};

// New checkboxTree object that holds all the regions and subregions in a tree-like structure.
export let checkboxTree = [
  {
    type: "region",
    text: "Africa",
    children: [
      {
        type: "subregion",
        text: "Northern Africa",
      },
      {
        type: "subregion",
        text: "Sub-Saharan Africa",
      },
    ],
  },
  {
    level: 1,
    type: "region",
    text: "Americas",
    children: [
      {
        type: "subregion",
        text: "Latin America and the Caribbean",
      },
      {
        type: "subregion",
        text: "Northern America",
      },
    ],
  },
  {
    type: "region",
    text: "Asia",
    children: [
      {
        type: "subregion",
        text: "Central Asia",
      },
      {
        type: "subregion",
        text: "Eastern Asia",
      },
      {
        type: "subregion",
        text: "South-eastern Asia",
      },
      {
        type: "subregion",
        text: "Southern Asia",
      },
      {
        type: "subregion",
        text: "Western Asia",
      },
    ],
  },
  {
    type: "region",
    text: "Europe",
    children: [
      {
        type: "subregion",
        text: "Eastern Europe",
      },
      {
        type: "subregion",
        text: "Northern Europe",
      },
      {
        type: "subregion",
        text: "Southern Europe",
      },
      {
        type: "subregion",
        text: "Western Europe",
      },
    ],
  },
  {
    type: "region",
    text: "Oceania",
    children: [
      {
        type: "subregion",
        text: "Australia and New Zealand",
      },
      {
        type: "subregion",
        text: "Melanesia",
      },
      {
        type: "subregion",
        text: "Micronesia",
      },
      {
        type: "subregion",
        text: "Polynesia",
      },
    ],
  },
];

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

export interface QueryForm {
  page: PageForm;
  region: { [key: string]: boolean };
  subregion: { [key: string]: boolean };
  institutionType: { [key: string]: boolean };
  openAccess: OpenAccess;
}

interface FilterFormProps {
  category: string;
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

const FilterForm = ({
  category,
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
  const isDirty = (): boolean => {
    return !lodashIsEqual(formik.values, defaultQueryForm);
  };

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit} data-test={`${platform}-${category}-form`}>
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

          <Accordion defaultIndex={[0]} allowMultiple variant="filterForm">
            <FilterAccordionItem name="Region">
              <CheckboxTree checkboxTree={checkboxTree} />
            </FilterAccordionItem>

            <FilterAccordionItem name="Open Access">
              <OpenAccessForm rangeSliderMinMaxValues={rangeSliderMinMaxValues} histograms={entityStats.histograms} />
            </FilterAccordionItem>

            {category === "institution" ? (
              <FilterAccordionItem name="Institution Type">
                <InstitutionTypeForm />
              </FilterAccordionItem>
            ) : (
              ""
            )}
          </Accordion>

          <HStack justifyContent="space-around" p={{ base: "24px 0px", md: "14px 0px" }} bgColor="white">
            <Button variant="submit" type="submit">
              Apply
            </Button>

            <Button variant="submit" onClick={onReset} isDisabled={!isDirty()}>
              Clear
            </Button>
          </HStack>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default memo(FilterForm);
