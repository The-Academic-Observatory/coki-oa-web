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
// Author: Alex Massen-Hane

import { Field, FastField, useField, useFormikContext } from "formik";
import { Checkbox, VStack } from "@chakra-ui/react";
import {
  AccordionButton,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  Text,
  useAccordionItemState,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { memo, useEffect, useCallback, ReactElement } from "react";
import { QueryForm } from "./FilterForm";

// Old region array still needs to be used for Formik and creating the QueryForm.
export const regions: { [key: string]: Array<string> } = {
  Africa: ["Northern Africa", "Sub-Saharan Africa"],
  Americas: ["Latin America and the Caribbean", "Northern America"],
  Asia: ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
};

// New regionsTree object that holds all the regions and subregions.
// New regions, subregions and lower levels can be easily added.
export const regionsTree = {
  level: 0,
  type: "Start",
  text: "Region / Subregion",
  children: [
    {
      level: 1,
      type: "region",
      text: "Africa",
      children: [
        {
          level: 2,
          type: "subregion",
          text: "Northern Africa",
        },
        {
          level: 2,
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
          level: 2,
          type: "subregion",
          text: "Latin America and the Caribbean",
        },
        {
          level: 2,
          type: "subregion",
          text: "Northern America",
        },
      ],
    },
    {
      level: 1,
      type: "region",
      text: "Asia",
      children: [
        {
          level: 2,
          type: "subregion",
          text: "Central Asia",
        },
        {
          level: 2,
          type: "subregion",
          text: "Eastern Asia",
        },
        {
          level: 2,
          type: "subregion",
          text: "South-eastern Asia",
        },
        {
          level: 2,
          type: "subregion",
          text: "Southern Asia",
        },
        {
          level: 2,
          type: "subregion",
          text: "Western Asia",
        },
      ],
    },
    {
      level: 1,
      type: "region",
      text: "Europe",
      children: [
        {
          level: 2,
          type: "subregion",
          text: "Eastern Europe",
        },
        {
          level: 2,
          type: "subregion",
          text: "Northern Europe",
        },
        {
          level: 2,
          type: "subregion",
          text: "Southern Europe",
        },
        {
          level: 2,
          type: "subregion",
          text: "Western Europe",
        },
      ],
    },
    {
      level: 1,
      type: "region",
      text: "Oceania",
      children: [
        {
          level: 2,
          type: "subregion",
          text: "Australia and New Zealand",
        },
        {
          level: 2,
          type: "subregion",
          text: "Melanesia",
        },
        {
          level: 2,
          type: "subregion",
          text: "Micronesia",
        },
        {
          level: 2,
          type: "subregion",
          text: "Polynesia",
        },
      ],
    },
  ],
};

export interface RegionRecursiveTreeFilteringProps {
  branch: any;
  type: string;
  text: string;
  level: any;
  children: any;
}

// Pass tree of regions and subregions onto the recursive function

// TO DO: Fix definition of types - when you include the props for the RegionRecursiveTreeFiltering function
// it kills the functions. It reads the tree object as "undefined".
const RegionRecursiveTreeFiltering = (): ReactElement => {
  return RecursiveTreeCheckbox(regionsTree);
};

// TO DO: Fix definition of types. Same thing happens with branch.children
export interface RecursiveTreeCheckboxProps extends AccordionItemProps {
  branch: any;
  type: string;
  text: string;
  level: any;
  children: any;
}

// Recursively go down branches and render checkboxes and input values into Formik
const RecursiveTreeCheckbox = (branch: RecursiveTreeCheckboxProps): ReactElement => {
  return (
    <>
      {branch.children.map((branchSub: RecursiveTreeCheckboxProps) => {
        // Form for filtering
        const { setFieldValue, handleChange } = useFormikContext<QueryForm>();
        const [field, meta] = useField(`${branchSub.type}.${branchSub.text}`);
        var { value } = meta;

        const onChange = useCallback(
          async (e: React.ChangeEvent<any>) => {
            // Handle change in formik
            handleChange(e);
            setFieldValue(`${branchSub.type}.${branchSub.text}`, e.target.checked);

            if ("children" in branchSub) {
              // Go through all branches below current branch and set it the same value as parent.
              RecursiveCheckboxTreeChangeForm(branchSub, e.target.checked, setFieldValue);
            }
          },
          [setFieldValue, branchSub],
        );

        // If there are more children on this branch, make it an accordian panel and expandable.
        // Render the leaf children at end of tree using fast method as re-rendering the fields can be slow.

        // TODO: Re-rendering the all checkboxes everytime one of the checkboxes is ticked.
        // Use an outside state of the formik values. If not the same as previous, only then re-render that checkbox.

        return (
          <VStack key={`${branchSub.text}`} alignItems="Left">
            <AccordionItem key={branchSub.text} pl={`${34 * (branchSub.level - 1)}` + "px"}>
              {({ isExpanded }) => (
                <>
                  {"children" in branchSub ? (
                    <OnChangeTriggerExpand checked={value}>
                      <AccordionButton
                        height={{ base: "48px", md: "42px" }}
                        bgColor="grey.300"
                        _hover={{
                          background: "grey.300",
                          color: "black",
                        }}
                      >
                        <Field
                          type="checkbox"
                          id={branchSub.text}
                          component={Checkbox}
                          {...field}
                          isChecked={value}
                          variant="filterForm"
                          colorScheme="checkbox"
                          onChange={onChange}
                          isIndeterminate={isIndeterminateChecked(branchSub, value)}
                          padding="6px"
                        >
                          <Text>{branchSub.text}</Text>
                        </Field>

                        {isExpanded ? (
                          <ChevronDownIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                        ) : (
                          <ChevronRightIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                        )}
                      </AccordionButton>
                    </OnChangeTriggerExpand>
                  ) : (
                    <FastField
                      type="checkbox"
                      id={branchSub.text}
                      component={Checkbox}
                      {...field}
                      isChecked={value}
                      variant="filterForm"
                      colorScheme="checkbox"
                      onChange={onChange}
                      padding="6px"
                    >
                      <Text>{branchSub.text}</Text>
                    </FastField>
                  )}

                  {"children" in branchSub ? (
                    <AccordionPanel>{RecursiveTreeCheckbox(branchSub)}</AccordionPanel>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </AccordionItem>
          </VStack>
        );
      })}
    </>
  );
};

interface OnChangeTriggerExpandProps {
  checked: boolean;
  children: any;
}

// Function to open accordion panel on clicking the checkbox, but doesn't open when unticking parent when already closed
function OnChangeTriggerExpand({ checked, children }: OnChangeTriggerExpandProps) {
  const { onOpen } = useAccordionItemState();

  if (!checked) {
    return <div onChange={() => onOpen()}>{children}</div>;
  } else {
    return children;
  }
}

// To set children as checked if parent branch is checked
const RecursiveCheckboxTreeChangeForm = function (
  branch: any,
  value: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | boolean) => void,
) {
  for (let branchSub of branch.children) {
    setFieldValue(`${branchSub.type}.${branchSub.text}`, value);

    if ("children" in branchSub) {
      RecursiveCheckboxTreeChangeForm(branchSub, value, setFieldValue);
    }
  }
};

// Check if children of this branch are ticked, and if so mark this parent checkbox as indeterminate or checked
const isIndeterminateChecked = function (branchSub: any, isParentAlreadyChecked: boolean) {
  const { setFieldValue, values } = useFormikContext();

  // Get a list of all values from formik for the children
  let isChecked: boolean[];
  isChecked = [];
  for (let branchSubSub of branchSub.children) {
    //subList.push(branchSubSub.text)
    isChecked.push(values[`${branchSub.children[0].type}`][branchSubSub.text]);
  }

  // The useEffect function fixes a warning about setting values in Formik.
  // This part marks the parent as checked if all the children are checked.
  const isParentChecked = isChecked.every((s) => s === true);
  useEffect(() => {
    if (isParentChecked && !isParentAlreadyChecked) {
      setFieldValue(`${branchSub.type}.${branchSub.text}`, true);
    } else if (!isParentChecked && isParentAlreadyChecked) {
      setFieldValue(`${branchSub.type}.${branchSub.text}`, false);
    }
  });

  // Mark this parent as indeterminate if only a few are checked
  const isIndeterminateCheckedSub = isChecked.some((s) => s === true) && !isParentChecked;

  return isIndeterminateCheckedSub;
};

export default memo(RegionRecursiveTreeFiltering);
