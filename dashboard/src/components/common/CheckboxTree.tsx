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

import { QueryForm } from "@/components/filter";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
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
import { FastField, Field, useField, useFormikContext } from "formik";
import React, { memo, ReactElement, useCallback, useEffect } from "react";

type CheckboxTreeProps = {
  nodes: Array<Node>;
};

export class Node {
  namespace: string;
  name: string;
  children: Array<Node>;

  constructor(namespace: string, name: string, children: Array<Node> = []) {
    this.namespace = namespace;
    this.name = name;
    this.children = children;
  }

  key(): string {
    return `${this.namespace}.${this.name}`;
  }
}

const CheckboxTree = ({ nodes }: CheckboxTreeProps): ReactElement => {
  // Keeps accordion state so that it can be controlled
  const [accordionIndex, setAccordionIndex] = React.useState<Array<number>>([]);

  return (
    <Accordion p="9px 12px 9px 24px" allowMultiple variant="checkboxTree" index={accordionIndex} reduceMotion={true}>
      {nodes.map((node: Node, i: number) => {
        return (
          <ParentCheckbox
            key={node.key()}
            node={node}
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
  node: Node;
  parentIndex: number;
  accordionIndex: Array<number>;
  setAccordionIndex: (values: Array<number>) => void;
}

const ParentCheckbox = ({ node, parentIndex, accordionIndex, setAccordionIndex }: ParentCheckboxProps) => {
  const { setFieldValue, handleChange, values } = useFormikContext<QueryForm>();
  const [field, meta] = useField(node.key());
  const { value } = meta;

  const onCheckboxChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      // Handle change in formik
      handleChange(e);

      // Set parent and child values
      const targetValue = e.target.checked;
      // setFieldValue(node.key(), targetValue);
      if (node.children.length !== 0) {
        // Go through all branches below current branch and set it the same value as parent.
        setCheckboxValues(node, targetValue, setFieldValue);
      }

      // Open accordion when checkbox is true and the accordion isn't already open
      if (targetValue && !accordionIndex.includes(parentIndex)) {
        setAccordionIndex(accordionIndex.concat([parentIndex]));
      }
    },
    [accordionIndex],
  );

  const isIndeterminate = useIndeterminateChecked(node, value, setFieldValue, values);

  const handleToggleClick = () => {
    if (accordionIndex.includes(parentIndex)) {
      setAccordionIndex(accordionIndex.filter((i) => i !== parentIndex));
    } else {
      setAccordionIndex(accordionIndex.concat([parentIndex]));
    }
  };

  return (
    <AccordionItem key={node.key()}>
      {({ isExpanded }) => {
        return (
          <>
            <AccordionButton>
              <Field
                // TODO: Change to FastField when there are more than 10 parent checkboxes.
                type="checkbox"
                data-test={node.key()}
                id={node.key()}
                component={Checkbox}
                {...field}
                isChecked={value}
                variant="checkboxTreeParent"
                colorScheme="checkbox"
                onChange={onCheckboxChange}
                isIndeterminate={isIndeterminate}
              />

              <Flex onClick={handleToggleClick}>
                <Text textStyle="checkboxTreeParent">{node.name}</Text>
                {/* Change Chevron arrow depending if it's expanded or not */}
                {isExpanded ? (
                  <ChevronDownIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                ) : (
                  <ChevronRightIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                )}
              </Flex>
            </AccordionButton>

            {/* This is rendered twice because of the hidden/shown version of the accordion panel. */}
            <AccordionPanel id={`${node.key()}`}>
              <VStack align="left" spacing="8px">
                {node.children.map((child: Node) => {
                  return <ChildCheckbox key={child.key()} node={child} />;
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
// TODO: this is the problem
const useIndeterminateChecked = function (
  node: Node,
  isParentAlreadyChecked: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  values: any,
) {
  // Get a list of all values from formik for the children
  let isChecked: boolean[] = [];
  for (const child of node.children) {
    isChecked.push(values[node.children[0].namespace][child.name]);
  }

  // The useEffect function fixes a warning about setting values in Formik.
  // This part marks the parent as checked if all the children are checked.
  const isParentChecked = isChecked.every((s) => s);
  // useEffect(() => {
  //   if (isParentChecked && !isParentAlreadyChecked) {
  //     setFieldValue(node.key(), true);
  //   } else if (!isParentChecked && isParentAlreadyChecked) {
  //     setFieldValue(node.key(), false);
  //   }
  // });

  // Mark this parent as indeterminate if only a few are checked
  return isChecked.some((s) => s) && !isParentChecked;
};

interface ChildCheckboxProps {
  node: Node;
}

const ChildCheckbox = ({ node }: ChildCheckboxProps) => {
  const { setFieldValue, handleChange } = useFormikContext<QueryForm>();
  const [field, meta] = useField(node.key());
  const { value } = meta;

  const onChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      // Handle change in formik
      handleChange(e);
      setFieldValue(node.key(), e.target.checked);
    },
    [setFieldValue, node],
  );

  return (
    <FastField
      type="checkbox"
      id={node.key()}
      component={Checkbox}
      {...field}
      isChecked={value}
      variant="checkboxTreeChild"
      colorScheme="checkbox"
      onChange={onChange}
    >
      {node.name}
    </FastField>
  );
};

// To set children as checked if parent branch is checked and run down the tree of values and mark them as checked.
const setCheckboxValues = function (
  node: Node,
  value: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
) {
  for (let child of node.children) {
    setFieldValue(node.key(), value);

    if (node.children.length !== 0) {
      setCheckboxValues(child, value, setFieldValue);
    }
  }
};

export default memo(CheckboxTree);
