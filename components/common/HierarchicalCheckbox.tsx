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

import { Field, FastField, useField, useFormikContext } from "formik";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { memo, useEffect, useCallback, ReactElement } from "react";
import { QueryForm } from "../filter/FilterForm";
import {
  Checkbox,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Text,
  useAccordionItemState,
  Flex,
} from "@chakra-ui/react";

// TODO: Fix the number of definitions / interfaces.

interface HierarchicalCheckboxParentProps {
  type: string;
  text: string;
  children: Array<HierarchicalCheckboxChildProps>;
}

interface HierarchicalCheckboxChildProps {
  type: string;
  text: string;
}

interface HierarchicalCheckboxProps {
  treeObject: Array<HierarchicalCheckboxParentProps>;
}
const HierarchicalCheckbox = ({ treeObject }: HierarchicalCheckboxProps): ReactElement => {
  //This component renders the partent accordion.
  return (
    <Accordion allowMultiple variant="hierarchicalCheckbox" reduceMotion={true}>
      {treeObject.map((branchSub: HierarchicalCheckboxParentProps) => {
        const { setFieldValue, handleChange } = useFormikContext<QueryForm>();
        const [field, meta] = useField(`${branchSub.type}.${branchSub.text}`);
        var { value } = meta;

        const onChangeSub = useCallback(
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

        // This is the parent checkbox, 1st level.
        return (
          <AccordionItem key={branchSub.text} pl="0px">
            {({ isExpanded }) => (
              <>
                <div data-test={`checkbox.${branchSub.type}.${branchSub.text}`}>
                  <OnChangeTriggerExpand checked={value}>
                    <AccordionButton data-test={`${branchSub.type}.${branchSub.text}`}>
                      <Flex alignItems="center">
                        <Field
                          // TODO: Change to FastField when there are more than 10 parent checkboxes.
                          type="checkbox"
                          id={branchSub.text}
                          component={Checkbox}
                          {...field}
                          isChecked={value}
                          variant="filterForm"
                          colorScheme="checkbox"
                          onChange={onChangeSub}
                          isIndeterminate={IsIndeterminateChecked(branchSub, value)}
                        />
                        <Text variant="filterForm">{branchSub.text}</Text>
                      </Flex>

                      {/* Change Chevron arrow depending if it's expanded or not */}
                      {isExpanded ? (
                        <ChevronDownIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                      ) : (
                        <ChevronRightIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                      )}
                    </AccordionButton>
                  </OnChangeTriggerExpand>

                  {/* This is rendered twice because of the hidden/shown version of the accordion panel. */}
                  <ChildHierarchicalCheckbox branchSub={branchSub} />
                </div>
              </>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

interface ChildHierarchicalCheckboxProps {
  branchSub: Array<HierarchicalCheckboxParentProps>;
}
const ChildHierarchicalCheckbox = ({ branchSub }: ChildHierarchicalCheckboxProps) => {
  const { setFieldValue, handleChange } = useFormikContext<QueryForm>();
  return (
    <AccordionPanel id={`${branchSub.type}.${branchSub.text}`}>
      {branchSub.children.map((branchSubSub: HierarchicalCheckboxChildProps) => {
        const [field, meta] = useField(`${branchSubSub.type}.${branchSubSub.text}`);
        var { value } = meta;

        const onChangeSubSub = useCallback(
          async (e: React.ChangeEvent<any>) => {
            // Handle change in formik
            handleChange(e);
            setFieldValue(`${branchSubSub.type}.${branchSubSub.text}`, e.target.checked);
          },
          [setFieldValue, branchSubSub],
        );

        return (
          <AccordionItem key={branchSubSub.text}>
            <FastField
              type="checkbox"
              id={branchSubSub.text}
              component={Checkbox}
              {...field}
              isChecked={value}
              variant="filterForm"
              colorScheme="checkbox"
              onChange={onChangeSubSub}
            >
              {branchSubSub.text}
            </FastField>
          </AccordionItem>
        );
      })}
    </AccordionPanel>
  );
};

interface OnChangeTriggerExpandProps {
  children: ReactElement;
  checked: boolean;
}

// Function to open accordion panel on clicking the checkbox, but doesn't open when unticking parent when already closed
function OnChangeTriggerExpand({ children, checked }: OnChangeTriggerExpandProps) {
  const { onOpen } = useAccordionItemState();

  if (!checked) {
    return <div onChange={() => onOpen()}>{children}</div>;
  } else {
    return children;
  }
}

// To set children as checked if parent branch is checked and run down the tree of values and mark them as checked.
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

// Check if children of this branch are checked, and if so mark this parent checkbox as indeterminate or checked
const IsIndeterminateChecked = function (branchSub: HierarchicalCheckboxParentProps, isParentAlreadyChecked: boolean) {
  const { setFieldValue, values } = useFormikContext();

  // Get a list of all values from formik for the children
  let isChecked: boolean[];
  isChecked = [];
  for (let branchSubSub of branchSub.children) {
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

export default memo(HierarchicalCheckbox);
