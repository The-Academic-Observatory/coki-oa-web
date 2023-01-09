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
// Author: James Diprose

import { ColumnInstance } from "react-table";
import { Flex, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import React, { memo } from "react";

interface ColumnProps {
  column: ColumnInstance;
}

const ColumnHeaders: { [id: string]: string } = {
  Institution: "Institution",
  Country: "Country",
  open: "Open",
  breakdown: "Breakdown",
  totalPublications: "Total Publications",
  openPublications: "Open Publications",
};

const ColumnHeadersMobile: { [id: string]: string } = {
  Institution: "AZ",
  Country: "AZ",
  openPublications: "Open",
  totalPublications: "Total",
  open: "Open%",
};

function Header({ column }: ColumnProps) {
  const subHeadings = ["Publisher open", "both", "other platform open", "closed"];
  return (
    <>
      {/* Desktop */}
      <Flex display={{ base: "none", smm: "block" }}>
        <HStack align="start" spacing="0">
          <Text>{ColumnHeaders[column.id]}</Text>
          {column.isSorted ? (
            column.isSortedDesc ? (
              <ArrowDownIcon viewBox=" 0 -2 24 24" />
            ) : (
              <ArrowUpIcon viewBox=" 0 -2 24 24" />
            )
          ) : (
            <ArrowDownIcon viewBox="0 0 0 0" />
          )}
        </HStack>
        {column.id === "breakdown" ? (
          <Grid key="subHeadingTable">
            {subHeadings.map((subHead: string) => {
              return (
                <GridItem key={subHead}>
                  <Text textStyle="tableSubHeader">{subHead}</Text>
                </GridItem>
              );
            })}
          </Grid>
        ) : (
          ""
        )}
      </Flex>

      {/* Mobile */}
      <Flex pl="20px" display={{ base: "block", smm: "none" }}>
        <HStack align="start" spacing="0">
          <Text>{ColumnHeadersMobile[column.id]}</Text>
          {column.isSorted ? (
            column.isSortedDesc ? (
              <ArrowDownIcon viewBox=" 0 -2 24 24" />
            ) : (
              <ArrowUpIcon viewBox=" 0 -2 24 24" />
            )
          ) : (
            <ArrowDownIcon viewBox="0 0 0 0" />
          )}
        </HStack>
      </Flex>
    </>
  );
}

export default memo(Header);
