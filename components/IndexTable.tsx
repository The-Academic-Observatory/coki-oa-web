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

import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import { Entity } from "../lib/model";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import DonutSparkline from "./DonutSparkline";
import BreakdownSparkline from "./BreakdownSparkline";
import Icon from "./Icon";
import Link from "./Link";

function makeHref(category: string, id: string) {
  return `${category}/${id}`;
}

function EntityCell({ value, entity }) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <a>
        <HStack>
          <Image
            rounded="full"
            objectFit="cover"
            boxSize="16px"
            src={entity.logo_s}
            alt={entity.name}
          />
          <Text>{entity.name}</Text>
        </HStack>
      </a>
    </Link>
  );
}

function OpenCell({ value, entity }) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <a>
        <DonutSparkline value={value} color="#f47328" size={18} />
      </a>
    </Link>
  );
}

function BreakdownCell({ value, entity }) {
  const href = makeHref(entity.category, entity.id);
  let stats = entity.stats;
  let values = [
    stats.p_outputs_publisher_open_only,
    stats.p_outputs_both,
    stats.p_outputs_other_platform_open_only,
    stats.p_outputs_closed,
  ];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];
  return (
    <Link href={href}>
      <a>
        <BreakdownSparkline
          key={href}
          values={values}
          colors={colors}
          width={110}
          height={17}
        />
      </a>
    </Link>
  );
}

function NumberCell({ value, entity }) {
  return <span>{value.toLocaleString()}</span>;
}

function LearnMoreCell({ value, entity }) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <Button as="a" variant="table" rightIcon={<ChevronRightIcon />}>
        <Text>Learn More</Text>
      </Button>
    </Link>
  );
}

function BreakdownHeader({ value, entity }) {
  return (
    <span>
      <Text>Breakdown</Text>
      <Text textStyle="tableSubHeader">
        Publisher open <br />
        both <br /> other platform open <br /> closed <br />
      </Text>
    </span>
  );
}

function paginate(page, nPages) {
  const window = 5;
  const half = Math.floor(window / 2);
  const endDist = nPages - page - 1;
  let start,
    end = 0;
  if (page < window) {
    start = 0;
    end = window - 1;
  } else if (endDist < window) {
    start = nPages - window;
    end = nPages - 1;
  } else {
    start = page - half;
    end = page + half;
  }

  const length = end - start + 1;
  return Array.from({ length: length }, (v, k) => k + start);
}

type Props = {
  entities: Array<Entity>;
  categoryName: string;
};

const IndexTable = ({ entities, categoryName }: Props) => {
  const data = entities;
  const columns = React.useMemo(
    () => [
      {
        Header: categoryName,
        accessor: "name",
        Cell: EntityCell,
        minWidth: 220,
        maxWidth: 220,
      },
      {
        Header: "Open",
        accessor: "stats.p_outputs_open",
        Cell: OpenCell,
      },
      {
        Header: BreakdownHeader,
        id: "breakdown",
        accessor: "stats.p_outputs_open",
        Cell: BreakdownCell,
        minWidth: 170,
        maxWidth: 170,
      },
      {
        Header: "Total Publications",
        accessor: "stats.n_outputs",
        Cell: NumberCell,
        isNumeric: true,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: "Open Publications",
        accessor: "stats.n_outputs_open",
        Cell: NumberCell,
        isNumeric: true,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        Header: "",
        Cell: LearnMoreCell,
        id: "learnMore",
        accessor: (e) => e,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: { pageIndex: 0, pageSize: 18 },
    },
    useSortBy,
    usePagination
  );

  let currentPageSize = pageSize;
  let pageSizeIncrement = pageSize;

  return (
    <Box>
      <Box overflowX="auto">
        <Table {...getTableProps()} size="sm" variant="dashboard">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                    minWidth={column.minWidth}
                    maxWidth={column.maxWidth}
                  >
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} zIndex="1">
                  {row.cells.map((cell) => (
                    <Td
                      {...cell.getCellProps()}
                      isNumeric={cell.column.isNumeric}
                      minWidth={cell.column.minWidth}
                      maxWidth={cell.column.maxWidth}
                    >
                      {cell.render("Cell", { entity: row.original })}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <VStack
        pt="24px"
        px="24px"
        pb="28px"
        textAlign="right"
        align="right"
        display={{ base: "flex", md: "none" }}
      >
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Button
            variant="dashboard"
            onClick={() => {
              currentPageSize += pageSizeIncrement;
              setPageSize(currentPageSize);
            }}
          >
            Load More
          </Button>
          <Button
            variant="dashboard"
            leftIcon={<Icon icon="filter" color="white" size={24} />}
          >
            Filter
          </Button>
        </Flex>

        <Text mt="28px !important" textStyle="lastUpdated">
          Last updated 6 December 2021
        </Text>
      </VStack>
      <Flex
        w="full"
        alignItems="center"
        align="center"
        justifyContent="space-between"
        p="32px 30px 30px"
        display={{ base: "none", md: "flex" }}
      >
        <Flex alignItems="center" align="center" justifyContent="space-between">
          <IconButton
            aria-label="Previous Page"
            variant="pureIconButton"
            icon={<ChevronLeftIcon />}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />
          {paginate(pageIndex, pageCount).map((page) => (
            <Flex
              layerStyle="pageButton"
              align="center"
              onClick={() => gotoPage(page)}
            >
              <Box className={pageIndex == page ? "pageBtnActive" : ""} />
            </Flex>
          ))}
          <IconButton
            aria-label="Next Page"
            variant="pureIconButton"
            icon={<ChevronRightIcon />}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          />
        </Flex>
        <Text textStyle="lastUpdated">Last updated 6 December 2021</Text>
      </Flex>
    </Box>
  );
};

export default IndexTable;