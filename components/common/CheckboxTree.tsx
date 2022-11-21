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

// Currently only a two-level checkbox tree.
// Can update it later for more levels when needed

import { FastField, Field, useField, useFormikContext } from "formik";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React, { memo, ReactElement, useCallback, useEffect } from "react";
import { QueryForm } from "../filter/FilterForm";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";

type CheckboxTreeProps = {
  checkboxTree: Array<Parent>;
};

type Parent = {
  type: string;
  text: string;
  children: Array<Child>;
};

type Child = {
  type: string;
  text: string;
};

const CheckboxTree = ({ checkboxTree }: CheckboxTreeProps): ReactElement => {
  // Keeps accordion state so that it can be controlled
  const [accordionIndex, setAccordionIndex] = React.useState<Array<number>>([]);

  return (
    <Accordion p="9px 12px 9px 24px" allowMultiple variant="checkboxTree" index={accordionIndex} reduceMotion={true}>
      {checkboxTree.map((parent: Parent, i: number) => {
        return (
          <ParentCheckbox
            key={parent.text}
            parent={parent}
            parentIndex={i}
            accordionIndex={accordionIndex}
            setAccordionIndex={setAccordionIndex}
          />
        );
      })}
    </Accordion>
  );
};

interface ParentCheckboxProps {
  parent: Parent;
  parentIndex: number;
  accordionIndex: Array<number>;
  setAccordionIndex: (values: Array<number>) => void;
}

const ParentCheckbox = ({ parent, parentIndex, accordionIndex, setAccordionIndex }: ParentCheckboxProps) => {
  const { setFieldValue, handleChange, values } = useFormikContext<QueryForm>();
  const key = `${parent.type}.${parent.text}`;
  const [field, meta] = useField(key);
  const { value } = meta;

  const onCheckboxChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      // Handle change in formik
      handleChange(e);

      // Set parent and child values
      const targetValue = e.target.checked;
      setFieldValue(key, targetValue);
      if ("children" in parent) {
        // Go through all branches below current branch and set it the same value as parent.
        setCheckboxValues(parent, targetValue, setFieldValue);
      }

      // Open accordion when checkbox is true and the accordion isn't already open
      if (targetValue && !accordionIndex.includes(parentIndex)) {
        setAccordionIndex(accordionIndex.concat([parentIndex]));
      }
    },
    [accordionIndex],
  );

  const isIndeterminate = useIndeterminateChecked(parent, value, setFieldValue, values);

  return (
    <AccordionItem key={parent.text}>
      {({ isExpanded }) => {
        return (
          <>
            <AccordionButton>
              <Field
                // TODO: Change to FastField when there are more than 10 parent checkboxes.
                type="checkbox"
                data-test={parent.text}
                id={parent.text}
                component={Checkbox}
                {...field}
                isChecked={value}
                variant="checkboxTreeParent"
                colorScheme="checkbox"
                onChange={onCheckboxChange}
                isIndeterminate={isIndeterminate}
              />

              <Flex
                onClick={() => {
                  if (accordionIndex.includes(parentIndex)) {
                    // Remove parent from accordion index
                    setAccordionIndex(accordionIndex.filter((i) => i !== parentIndex));
                  } else {
                    // Add parent to accordion index
                    setAccordionIndex(accordionIndex.concat([parentIndex]));
                  }
                }}
              >
                <Text textStyle="checkboxTreeParent">{parent.text}</Text>
                {/* Change Chevron arrow depending if it's expanded or not */}
                {isExpanded ? (
                  <ChevronDownIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                ) : (
                  <ChevronRightIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                )}
              </Flex>
            </AccordionButton>

            {/* This is rendered twice because of the hidden/shown version of the accordion panel. */}
            <AccordionPanel id={`${key}`}>
              <VStack align="left" spacing="8px">
                {parent.children.map((child: Child) => {
                  return <ChildCheckbox key={child.text} child={child} />;
                })}
              </VStack>
            </AccordionPanel>
          </>
        );
      }}
    </AccordionItem>
  );
};

// Check if children of this branch are checked, and if so mark this parent checkbox as indeterminate or checked
const useIndeterminateChecked = function (
  parent: Parent,
  isParentAlreadyChecked: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  values: any,
) {
  // Get a list of all values from formik for the children
  let isChecked: boolean[] = [];
  for (const child of parent.children) {
    isChecked.push(values[`${parent.children[0].type}`][child.text]);
  }

  // The useEffect function fixes a warning about setting values in Formik.
  // This part marks the parent as checked if all the children are checked.
  const isParentChecked = isChecked.every((s) => s);
  useEffect(() => {
    if (isParentChecked && !isParentAlreadyChecked) {
      setFieldValue(`${parent.type}.${parent.text}`, true);
    } else if (!isParentChecked && isParentAlreadyChecked) {
      setFieldValue(`${parent.type}.${parent.text}`, false);
    }
  });

  // Mark this parent as indeterminate if only a few are checked
  return isChecked.some((s) => s) && !isParentChecked;
};

interface ChildCheckboxProps {
  child: Child;
}

const ChildCheckbox = ({ child }: ChildCheckboxProps) => {
  const { setFieldValue, handleChange } = useFormikContext<QueryForm>();
  const [field, meta] = useField(`${child.type}.${child.text}`);
  const { value } = meta;

  const onChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      // Handle change in formik
      handleChange(e);
      setFieldValue(`${child.type}.${child.text}`, e.target.checked);
    },
    [setFieldValue, child],
  );

  return (
    <FastField
      type="checkbox"
      id={child.text}
      component={Checkbox}
      {...field}
      isChecked={value}
      variant="checkboxTreeChild"
      colorScheme="checkbox"
      onChange={onChange}
    >
      {child.text}
    </FastField>
  );
};

// To set children as checked if parent branch is checked and run down the tree of values and mark them as checked.
const setCheckboxValues = function (
  checkbox: Parent | Child,
  value: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
) {
  if ("children" in checkbox) {
    for (let child of checkbox.children) {
      setFieldValue(`${child.type}.${child.text}`, value);

      if ("children" in child) {
        setCheckboxValues(child, value, setFieldValue);
      }
    }
  }
};

export default memo(CheckboxTree);
