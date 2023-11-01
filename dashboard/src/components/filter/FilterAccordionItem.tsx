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

import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { AccordionButton, AccordionItem, AccordionPanel, Box, Text } from "@chakra-ui/react";
import React, { ReactNode, MouseEventHandler } from "react";
import { TbFilterExclamation } from "react-icons/tb";

interface FilterAccordionItemProps {
  children: ReactNode;
  name: string;
  forceOpenClose?: boolean;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  isDirty: () => boolean;
}

const FilterAccordionItem = ({ children, name, onClick, forceOpenClose, isDirty }: FilterAccordionItemProps) => {
  if (forceOpenClose == undefined) {
    return (
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton onClick={onClick} className="filterAccordionButton">
              <Text flex="1">{name}</Text>
              {isDirty() && (
                <Box
                  className="filterOnWarningIcon"
                  pr={{ base: "7px", md: "5px" }}
                  fontSize={{ base: "20px", md: "16px" }}
                >
                  <TbFilterExclamation />
                </Box>
              )}

              {isExpanded ? (
                <CloseIcon fontSize={{ base: "14px", md: "10px" }} mx="1px" />
              ) : (
                <AddIcon fontSize={{ base: "16px", md: "12px" }} />
              )}
            </AccordionButton>
            <AccordionPanel>{isExpanded ? children : null}</AccordionPanel>
          </>
        )}
      </AccordionItem>
    );
  } else {
    return (
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton onClick={onClick}>
              <Text flex="1">{name}</Text>
              {isExpanded || forceOpenClose ? (
                <CloseIcon fontSize={{ base: "14px", md: "10px" }} mx="1px" />
              ) : (
                <AddIcon fontSize={{ base: "16px", md: "12px" }} />
              )}
            </AccordionButton>
            <AccordionPanel>{isExpanded || forceOpenClose ? children : null}</AccordionPanel>
          </>
        )}
      </AccordionItem>
    );
  }
};

export default FilterAccordionItem;
