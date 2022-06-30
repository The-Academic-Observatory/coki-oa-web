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
// Author: James Diprose, Aniek Roelofs

import {
  Box,
  BoxProps,
  Button,
  Flex,
  HStack,
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
import React, { useEffect } from "react";
import { Cell, ColumnInstance, Row, usePagination, useSortBy, useTable } from "react-table";
import { Entity } from "../lib/model";
import { ChevronRightIcon, ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import DonutSparkline from "./DonutSparkline";
import BreakdownSparkline from "./BreakdownSparkline";
import Icon from "./Icon";
import Link from "./Link";
import Pagination from "./Pagination";
import { makeFilterUrl } from "../lib/api";

function makeHref(category: string, id: string) {
  return `/${category}/${id}`;
}

interface EntityProps {
  value: number;
  entity: Entity;
}

function EntityCell({ entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href}>
      <HStack>
        <Box width="16px" height="16px" minWidth="16px">
          <Image rounded="full" objectFit="cover" boxSize="16px" src={entity.logo_s} />
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

function BreakdownCell({ entity }: EntityProps) {
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
      <BreakdownSparkline values={values} colors={colors} width={110} height={17} />
    </Link>
  );
}

function NumberCell({ value }: EntityProps) {
  return <span>{value.toLocaleString()}</span>;
}

function LearnMoreCell({ entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  return (
    <Link href={href} textDecorationColor="white !important">
      <Button variant="table" rightIcon={<ChevronRightIcon />}>
        <Text>Learn More</Text>
      </Button>
    </Link>
  );
}

const ColumnHeaders: { [id: string]: string } = {
  Institution: "Institution",
  Country: "Country",
  open: "Open",
  breakdown: "Breakdown",
  totalPublications: "Total Publications",
  openPublications: "Open Publications",
};

interface ColumnProps {
  column: ColumnInstance;
}

function CreateHeader({ column }: ColumnProps) {
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
          Publisher open <br />
          both <br /> other platform open <br /> closed <br />
        </Text>
      ) : (
        ""
      )}
    </span>
  );
}

const searchColumns: { [id: string]: string } = {
  Institution: "name",
  Country: "name",
  open: "stats.p_outputs_open",
  breakdown: "stats.p_outputs_open",
  totalPublications: "stats.n_outputs",
  openPublications: "stats.n_outputs_open",
};

interface Props extends BoxProps {
  firstPage: Array<Entity>;
  categoryName: string;
  maxPageSize: number;
  lastUpdated: string;
  searchParams: string;
  filterParams: string;
  setSortParams: (e: string) => void;
  setPageParams: (e: string) => void;
  setMinMax: (e: {
    min: { n_outputs: number; n_outputs_open: number; p_outputs_open: number };
    max: { n_outputs: number; n_outputs_open: number; p_outputs_open: number };
  }) => void;
  onOpenFilter: () => void;
}

const IndexTable = ({
  firstPage,
  categoryName,
  maxPageSize,
  lastUpdated,
  searchParams,
  filterParams,
  setSortParams,
  setPageParams,
  setMinMax,
  onOpenFilter,
  ...rest
}: Props) => {
  const columns = React.useMemo<Array<any>>(
    () => [
      {
        Header: CreateHeader,
        id: categoryName,
        accessor: "name",
        Cell: EntityCell,
        minWidth: 100,
        maxWidth: 220,
        width: "45%",
      },
      {
        Header: CreateHeader,
        id: "open",
        accessor: "stats.p_outputs_open",
        Cell: OpenCell,
        minWidth: 70,
        maxWidth: 200,
        width: "12.5%",
        sortDescFirst: true,
      },
      {
        Header: CreateHeader,
        id: "breakdown",
        accessor: "stats.p_outputs_open",
        Cell: BreakdownCell,
        minWidth: 130,
        maxWidth: 200,
        width: "12.5%",
        sortDescFirst: true,
      },
      {
        Header: CreateHeader,
        id: "totalPublications",
        accessor: "stats.n_outputs",
        Cell: NumberCell,
        isNumeric: true,
        minWidth: 100,
        maxWidth: 150,
        width: "12.5%",
        sortDescFirst: true,
      },
      {
        Header: CreateHeader,
        id: "openPublications",
        accessor: "stats.n_outputs_open",
        Cell: NumberCell,
        isNumeric: true,
        minWidth: 100,
        maxWidth: 150,
        width: "12.5%",
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
    [categoryName],
  );

  // Fetch and update country and institution list
  const [pageData, setPageData] = React.useState({
    rowData: firstPage,
    isLoading: false,
    totalEntities: 0,
  });

  const [currentPage, setCurrentPage] = React.useState(0);
  useEffect(() => {
    setCurrentPage(0);
  }, [filterParams]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setPageSize,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data: pageData.rowData,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      disableSortRemove: true,
      initialState: {
        pageIndex: 0,
        pageSize: maxPageSize,
        sortBy: React.useMemo<Array<any>>(() => [{ id: "open", desc: true }], []),
      },
    },
    useSortBy,
    usePagination,
  );

  React.useEffect(() => {
    const sortByColumn = searchColumns[sortBy[0]["id"]];
    const sortDesc = sortBy[0]["desc"];
    const orderDir = sortDesc ? "dsc" : "asc";
    const sortParams = `orderBy=${sortByColumn}&orderDir=${orderDir}`;
    // Set page to 0 on mobile when changing the order
    if (loadMore) {
      setCurrentPage(0);
    }
    setSortParams(sortParams);
  }, [sortBy, setSortParams]);

  React.useEffect(() => {
    const pageParams = `page=${currentPage}`;
    setPageParams(pageParams);
  }, [currentPage]);

  const [loadMore, setLoadMore] = React.useState(false);

  React.useEffect(() => {
    const endpoint = categoryName === "Country" ? "countries" : "institutions";
    const url = makeFilterUrl(endpoint + searchParams);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (loadMore && currentPage > 0) {
          data["items"] = pageData.rowData.concat(data.items);
          setPageSize(data.items.length);
        }
        setPageData({
          isLoading: false,
          rowData: data.items,
          totalEntities: data.nItems,
        });
      });
  }, [searchParams]);

  return (
    <Box {...rest}>
      {/*100vw is required so that the contaƒiner for the table does not increase in width with the table*/}
      <Box overflowX="auto" maxWidth="100vw">
        <Table {...getTableProps()} size="sm" variant="dashboard">
          <Thead>
            {headerGroups.map((headerGroup) => {
              let props = headerGroup.getHeaderGroupProps();
              return (
                <Tr key={props.key}>
                  {headerGroup.headers.map((column: any) => {
                    const props = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <Th
                        key={props.key}
                        {...props}
                        minWidth={column.minWidth}
                        maxWidth={column.maxWidth}
                        width={column.width}
                      >
                        {column.render("Header")}
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row: Row<any>) => {
              prepareRow(row);
              return (
                <Tr key={row.original.id} role="row" zIndex="1" data-test={row.original.id}>
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
      <VStack pt="24px" px="24px" pb="28px" textAlign="right" align="right" display={{ base: "flex", md: "none" }}>
        <Flex w="full" alignItems="center" justifyContent="space-between">
          <Button
            variant="dashboard"
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setLoadMore(true);
            }}
          >
            Load More
          </Button>
          <Button variant="dashboard" leftIcon={<Icon icon="filter" color="white" size={24} />} onClick={onOpenFilter}>
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
        <Pagination
          totalRows={pageData.totalEntities}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={maxPageSize}
        />
        <Text textStyle="lastUpdated">Data updated {lastUpdated}</Text>
      </Flex>
    </Box>
  );
};

export default IndexTable;
