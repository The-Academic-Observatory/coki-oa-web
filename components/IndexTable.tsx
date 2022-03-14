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
  BoxProps,
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
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Cell, Row, usePagination, useSortBy, useTable } from "react-table";
import { Entity } from "../lib/model";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
} from "@chakra-ui/icons";
import DonutSparkline from "./DonutSparkline";
import BreakdownSparkline from "./BreakdownSparkline";
import Icon from "./Icon";
import Link from "./Link";

function makeHref(category: string, id: string) {
  return `/${category}/${id}`;
}

interface EntityProps {
  value: number;
  entity: Entity;
}

function EntityCell({ value, entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <HStack>
        <Box width="16px" height="16px" minWidth="16px">
          <Image
            rounded="full"
            objectFit="cover"
            boxSize="16px"
            src={entity.logo_s}
          />
        </Box>
        <Text>{entity.name}</Text>
      </HStack>
    </Link>
  );
}

function OpenCell({ value, entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <DonutSparkline value={value} color="#f47328" size={18} />
    </Link>
  );
}

function BreakdownCell({ value, entity }: EntityProps) {
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
      <BreakdownSparkline
        values={values}
        colors={colors}
        width={110}
        height={17}
      />
    </Link>
  );
}

function NumberCell({ value, entity }: EntityProps) {
  return <span>{value.toLocaleString()}</span>;
}

function LearnMoreCell({ value, entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href} textDecorationColor="white !important">
      <Button variant="table" rightIcon={<ChevronRightIcon />}>
        <Text>Learn More</Text>
      </Button>
    </Link>
  );
}

function BreakdownHeader({ value, entity }: EntityProps) {
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

function paginate(page: number, nPages: number) {
  const window = 5;
  const half = Math.floor(window / 2);
  const endDist = nPages - page - 1;
  let start = 0;
  let end = 0;
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

interface Props extends BoxProps {
  entities: Array<Entity>;
  categoryName: string;
  maxPageSize: number;
  lastUpdated: Date;
}

const IndexTable = ({
  entities,
  categoryName,
  maxPageSize,
  lastUpdated,
  ...rest
}: Props) => {
  const data = entities;
  const columns = React.useMemo<Array<any>>(
    () => [
      {
        Header: categoryName,
        accessor: "name",
        Cell: EntityCell,
        minWidth: 150,
        maxWidth: 220,
        width: "40%",
      },
      {
        Header: "Open",
        accessor: "stats.p_outputs_open",
        Cell: OpenCell,
        // maxWidth: 200,
        width: "15%",
        sortDescFirst: true,
      },
      {
        Header: BreakdownHeader,
        id: "breakdown",
        accessor: "stats.p_outputs_open",
        Cell: BreakdownCell,
        minWidth: 170,
        maxWidth: 200,
        width: "20%",
        sortDescFirst: true,
      },
      {
        Header: "Total Publications",
        accessor: "stats.n_outputs",
        Cell: NumberCell,
        isNumeric: true,
        minWidth: 130,
        maxWidth: 150,
        width: "10%",
        sortDescFirst: true,
      },
      {
        Header: "Open Publications",
        accessor: "stats.n_outputs_open",
        Cell: NumberCell,
        isNumeric: true,
        minWidth: 130,
        maxWidth: 150,
        width: "10%",
        sortDescFirst: true,
      },
      {
        Header: "",
        Cell: LearnMoreCell,
        id: "learnMore",
        accessor: (e: any) => e,
        width: "5%",
      },
    ],
    [categoryName]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetSortBy: false,
      disableSortRemove: true,
      initialState: { pageIndex: 0, pageSize: maxPageSize },
    },
    useSortBy,
    usePagination
  );

  let currentPageSize = pageSize;
  let pageSizeIncrement = pageSize;

  return (
    <Box {...rest}>
      {/*100vw is required so that the container for the table does not increase in width with the table*/}
      <Box overflowX="auto" maxWidth="100vw">
        <Table {...getTableProps()} size="sm" variant="dashboard">
          <Thead>
            {headerGroups.map((headerGroup) => {
              let props = headerGroup.getHeaderGroupProps();
              return (
                <Tr key={props.key}>
                  {headerGroup.headers.map((column: any) => {
                    const props = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <Th
                        key={props.key}
                        {...props}
                        minWidth={column.minWidth}
                        maxWidth={column.maxWidth}
                        width={column.width}
                      >
                        <Flex>
                          {column.render("Header")}
                          {/* Add a sort direction indicator */}
                          <span>
                            {column.Header == "" ? (
                              ""
                            ) : column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDownIcon />
                              ) : (
                                <ArrowUpIcon />
                              )
                            ) : (
                              <ArrowUpDownIcon />
                            )}
                          </span>
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row: Row<any>, i: number) => {
              prepareRow(row);
              return (
                <Tr
                  key={row.original.id}
                  role="row"
                  zIndex="1"
                  data-test={row.original.id}
                >
                  {row.cells.map((cell: Cell<any, any>) => {
                    let key = cell.getCellProps().key;
                    return (
                      <Td
                        key={key}
                        role="cell"
                        isNumeric={cell.column.isNumeric}
                        minWidth={cell.column.minWidth}
                        maxWidth={cell.column.maxWidth}
                        width={cell.column.width}
                      >
                        {cell.render("Cell", { entity: row.original })}
                      </Td>
                    );
                  })}
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
          Data updated {lastUpdated}
        </Text>
      </VStack>
      <Flex
        w="full"
        alignItems="center"
        align="center"
        justifyContent="space-between"
        p="16px 30px 50px"
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
              key={page}
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
        <Text textStyle="lastUpdated">Data updated {lastUpdated}</Text>
      </Flex>
    </Box>
  );
};

export default IndexTable;
