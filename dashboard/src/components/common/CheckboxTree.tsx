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
// Author: Alex Massen-Hane, James Diprose

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
import { Field, useField, useFormikContext } from "formik";
import lodashGet from "lodash.get";
import React, { memo, ReactElement, useCallback, useEffect } from "react";

type CheckboxTreeProps = {
  nodes: Array<Node>;
};

export class Node {
  parent: Node | null;
  namespace: string;
  value: string;
  children: Array<Node>;

  constructor(namespace: string, value: string, children: Array<Node> = []) {
    this.parent = null;
    this.namespace = namespace;
    this.value = value;
    this.children = children;
    for (const child of this.children) {
      child.parent = this;
    }
  }

  public key(): string {
    return `${this.path()}.value`;
  }

  private path(): string {
    const key = `${this.namespace}.${this.value}`;
    if (this.parent !== null) {
      return `${this.parent.path()}.${key}`;
    }
    return key;
  }
}

const CheckboxTree = ({ nodes }: CheckboxTreeProps): ReactElement => {
  // Keeps accordion state so that it can be controlled
  const [accordionIndex, setAccordionIndex] = React.useState<Array<number>>([]);
  const { setFieldValue, values } = useFormikContext<QueryForm>();

  // Update parent checked state based on state of children
  useEffect(() => {
    for (const node of nodes) {
      const isParentChecked = lodashGet(values, node.key());
      const areAllChildrenChecked = node.children.every((child) => lodashGet(values, child.key()));

      // When:
      // isParentChecked is true and areAllChildrenChecked is false: set isParentChecked to areAllChildrenChecked (false) as now all children are not checked and so parent should be not checked.
      // isParentChecked is false and areAllChildrenChecked is true: set isParentChecked to areAllChildrenChecked (true) as now all children are checked and so parent should be checked.
      if (isParentChecked != areAllChildrenChecked) {
        setFieldValue(node.key(), areAllChildrenChecked);
      }
    }
  }, [nodes, setFieldValue, values]);

  return (
    <Accordion p="9px 12px 9px 24px" allowMultiple variant="checkboxTree" index={accordionIndex} reduceMotion={true}>
      {nodes.map((node: Node, accordionItemId: number) => {
        return (
          <CheckboxTreeItem
            key={node.key()}
            node={node}
            accordionItemId={accordionItemId}
            accordionIndex={accordionIndex}
            setAccordionIndex={setAccordionIndex}
          />
        );
      })}
    </Accordion>
  );
};

interface CheckboxTreeItemProps {
  node: Node;
  accordionItemId: number;
  accordionIndex: Array<number>;
  setAccordionIndex: (values: Array<number>) => void;
}

const CheckboxTreeItem = memo(({ node, accordionItemId, accordionIndex, setAccordionIndex }: CheckboxTreeItemProps) => {
  const { setFieldValue, handleChange, values } = useFormikContext();
  const key = node.key();
  const [field, meta] = useField(key);
  const { value } = meta;

  const onChangeParent = useCallback(
    (e: React.ChangeEvent<any>) => {
      // Handle change in formik
      handleChange(e);

      // Set parent and child values
      const targetValue = e.target.checked;
      setFieldValue(key, targetValue);
      if (node.children.length) {
        // Go through all branches below current branch and set it the same value as parent.
        setChildrenChecked(node, targetValue, setFieldValue);
      }

      // Open accordion when checkbox is true and the accordion isn't already open
      if (targetValue && !accordionIndex.includes(accordionItemId)) {
        toggleAccordion(accordionItemId, accordionIndex, setAccordionIndex);
      }
    },
    [handleChange, setFieldValue, node, key, accordionItemId, accordionIndex, setAccordionIndex],
  );

  const onChangeChild = useCallback(
    (e: React.ChangeEvent<any>) => {
      // Handle change in formik
      handleChange(e);
      setFieldValue(key, e.target.checked);
    },
    [handleChange, setFieldValue, key],
  );

  // Calculate if parent is in an indeterminate state
  const isIndeterminate = calcIsIndeterminate(node, values);

  // Render accordion if there are children
  if (node.children && node.children.length > 0) {
    return (
      <AccordionItem key={key}>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Field
                {...field}
                id={node.key()}
                data-test={node.key()}
                type="checkbox"
                component={Checkbox}
                isChecked={value}
                onChange={onChangeParent}
                isIndeterminate={isIndeterminate}
                variant="checkboxTreeParent"
                colorScheme="checkbox"
              />

              <Flex
                onClick={() => {
                  toggleAccordion(accordionItemId, accordionIndex, setAccordionIndex);
                }}
              >
                <Text textStyle="checkboxTreeParent">{node.value}</Text>
                {/* Change Chevron arrow depending on if it's expanded or not */}
                {isExpanded ? (
                  <ChevronDownIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                ) : (
                  <ChevronRightIcon fontSize={{ base: "26px", md: "20px" }} mx="1px" />
                )}
              </Flex>
            </AccordionButton>
            <AccordionPanel>
              <VStack align="left" spacing="8px">
                {node.children.map((child) => (
                  <CheckboxTreeItem
                    key={child.key()}
                    node={child}
                    accordionIndex={accordionIndex}
                    accordionItemId={accordionItemId}
                    setAccordionIndex={setAccordionIndex}
                  />
                ))}
              </VStack>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    );
  }

  // Render checkbox directly if there are no children
  return (
    <Checkbox
      {...field}
      id={node.key()}
      data-test={node.key()}
      isChecked={value}
      onChange={onChangeChild}
      variant="checkboxTreeChild"
      colorScheme="checkbox"
    >
      {node.value}
    </Checkbox>
  );
});
CheckboxTreeItem.displayName = "CheckboxTreeItem";

const calcIsIndeterminate = (node: Node, values: any): boolean => {
  const isAnyChildChecked = node.children.some((child) => lodashGet(values, child.key()));
  const isParentChecked = lodashGet(values, node.key());
  return isAnyChildChecked && !isParentChecked;
};

// To set children as checked if parent branch is checked and run down the tree of values and mark them as checked.
const setChildrenChecked = (
  node: Node,
  value: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
) => {
  for (const child of node.children) {
    setFieldValue(child.key(), value);
    if (child.children.length) {
      setChildrenChecked(child, value, setFieldValue);
    }
  }
};

const toggleAccordion = (
  accordionItemId: number,
  accordionIndex: Array<number>,
  setAccordionIndex: (values: Array<number>) => void,
) => {
  if (accordionIndex.includes(accordionItemId)) {
    // Remove parent from accordion index
    setAccordionIndex(accordionIndex.filter((i) => i !== accordionItemId));
  } else {
    // Add parent to accordion index
    setAccordionIndex(accordionIndex.concat([accordionItemId]));
  }
};

export default memo(CheckboxTree);
