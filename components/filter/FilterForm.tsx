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

import React, { memo, useCallback } from "react";
import { Accordion, Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";
import { Form, FormikProvider, useFormik } from "formik";
import Icon from "../common/Icon";
import RegionForm from "./RegionForm";
import SubregionForm from "./SubregionForm";
import FilterAccordionItem from "./FilterAccordionItem";
import { EntityStats } from "../../lib/model";
import InstitutionTypeForm from "./InstitutionTypeForm";
import OpenAccessForm from "./OpenAccessForm";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffectAfterRender } from "../../lib/hooks";
import lodashIsEqual from "lodash.isequal";

const filterWidth = 250;

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
  queryForm: QueryForm;
  setQueryForm: (q: QueryForm) => void;
  defaultQueryForm: QueryForm;
  entityStats: EntityStats;
  resetFormState: number;
  onClose?: () => void;
  title?: string;
}

const FilterForm = ({
  category,
  queryForm,
  setQueryForm,
  defaultQueryForm,
  entityStats,
  resetFormState,
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
      <Form onSubmit={formik.handleSubmit}>
        <Box boxShadow={{ base: "none", md: "0px 2px 5px 2px rgba(0,0,0,0.05)" }} maxWidth={{ md: `${filterWidth}px` }}>
          <HStack bg="brand.500" justifyContent="center" spacing="14px" height="60px" position="relative">
            <Box>
              <Icon icon="filter" color="white" size={24} />
            </Box>
            <Text fontWeight="900" fontSize={{ base: "18px", md: "12px" }} textTransform="uppercase" color="white">
              {title === undefined && "Filters"}
              {title !== undefined && title}
            </Text>

            <IconButton
              variant="clean"
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

          <Accordion allowMultiple variant="filterForm">
            <FilterAccordionItem name="Region">
              <RegionForm />
            </FilterAccordionItem>
          </Accordion>

          <Accordion allowMultiple variant="filterForm">
            <FilterAccordionItem name="Subregion">
              <SubregionForm />
            </FilterAccordionItem>
          </Accordion>

          <Accordion allowMultiple variant="filterForm">
            <FilterAccordionItem name="Open Access">
              <OpenAccessForm defaultOpenAccess={defaultQueryForm.openAccess} histograms={entityStats.histograms} />
            </FilterAccordionItem>
          </Accordion>

          {category === "institution" ? (
            <Accordion allowMultiple variant="filterForm">
              <FilterAccordionItem name="Institution Type">
                <InstitutionTypeForm />
              </FilterAccordionItem>
            </Accordion>
          ) : (
            ""
          )}

          <HStack justifyContent="space-around" p={{ base: "24px 0px", md: "14px 0px" }} bgColor="white">
            <Button variant="filterForm" type="submit">
              <Text>Apply</Text>
            </Button>

            <Button variant="filterForm" onClick={onReset} disabled={!isDirty()}>
              <Text>Clear</Text>
            </Button>
          </HStack>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default memo(FilterForm);
