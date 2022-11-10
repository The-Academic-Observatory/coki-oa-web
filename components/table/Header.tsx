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
import { HStack, Text } from "@chakra-ui/react";
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

function Header({ column }: ColumnProps) {
  const subHeadings = ["Publisher open", "both", "other platform open", "closed"];
  return (
    <span>
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
        <Text textStyle="tableSubHeader">
          <table>
            {subHeadings.map((subHead: string) => {
              return <tr>{subHead}</tr>;
            })}
          </table>
        </Text>
      ) : (
        ""
      )}
    </span>
  );
}

export default memo(Header);
