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

import { QueryForm } from "@/components/filter";
import {
  BreakdownCell,
  EntityCell,
  Header,
  LearnMoreCell,
  NoResults,
  NumberCell,
  OpenCell,
  Pagination,
  SkeletonResults,
} from "@/components/table";
import { useEffectAfterRender } from "@/lib/hooks";
import { Entity, QueryResult } from "@/lib/model";
import { Box, BoxProps, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { memo } from "react";
import { Cell, Row, usePagination, useSortBy, useTable } from "react-table";

export function makeHref(category: string, id: string) {
  return `/${category}/${id}`;
}

export interface EntityProps {
  value: number;
  entity: Entity;
}

interface Props extends BoxProps {
  entityTypeName: string;
  queryResult: QueryResult;
  queryForm: QueryForm;
  setQueryForm: (q: QueryForm) => void;
  isLoading: boolean;
  lastUpdated: string;
  onResetQueryForm: () => void;
}

const IndexTable = ({
  entityTypeName,
  queryResult,
  queryForm,
  setQueryForm,
  isLoading,
  lastUpdated,
  onResetQueryForm,
  ...rest
}: Props) => {
  // Columns definitions
  const columns = React.useMemo<Array<any>>(
    () => [
      {
        Header: Header,
        id: entityTypeName,
        accessor: "name",
        Cell: EntityCell,
        minWidth: 100,
        maxWidth: 220,
        width: "45%",
      },
      {
        Header: Header,
        id: "open",
        accessor: "stats.p_outputs_open",
        Cell: OpenCell,
        minWidth: 70,
        maxWidth: 200,
        width: "12.5%",
        sortDescFirst: true,
      },
      {
        Header: Header,
        id: "breakdown",
        accessor: "stats.p_outputs_open",
        Cell: BreakdownCell,
        minWidth: 130,
        maxWidth: 200,
        width: "12.5%",
        disableSortBy: true,
      },
      {
        Header: Header,
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
        Header: Header,
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
        disableSortBy: true,
      },
    ],
    [entityTypeName],
  );

  // Memoized data
  const data = React.useMemo<Array<Entity>>(() => queryResult.items, [queryResult.items]);

  // Current page
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  // Default sort by params
  const defaultSortBy = React.useMemo<Array<any>>(() => [{ id: "open", desc: true }], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setSortBy,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data: data,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      disableSortRemove: true,
      initialState: {
        pageIndex: queryForm.page.page,
        pageSize: queryForm.page.limit,
        sortBy: defaultSortBy,
      },
    },
    useSortBy,
    usePagination,
  );

  const getTableOrderState = React.useCallback(() => {
    // Get orderBy and orderDir parameters
    const columnSortBy = sortBy[0];
    const orderBy = columns.find((column) => column.id === columnSortBy.id).accessor;
    const orderDir = columnSortBy.desc ? "dsc" : "asc";

    return [orderBy, orderDir];
  }, [columns, sortBy]);

  // Callback when sorting parameters changed by user
  useEffectAfterRender(() => {
    const [orderBy, orderDir] = getTableOrderState();

    // Update the orderBy accessor and the orderDir
    const q = {
      ...queryForm,
      page: { ...queryForm.page, page: currentPage, orderBy: orderBy, orderDir: orderDir },
    };
    setQueryForm(q);
  }, [sortBy, currentPage]);

  // Callback when queryForm.page parameter is changed by the user
  useEffectAfterRender(() => {
    setCurrentPage(queryForm.page.page);

    // Only update sorting parameters if they have changed from the current table state
    const [orderBy, orderDir] = getTableOrderState();
    if (orderBy !== queryForm.page.orderBy || orderDir != queryForm.page.orderDir) {
      setSortBy(defaultSortBy);
    }
  }, [queryForm.page]);

  return (
    <Box {...rest}>
      {/*100vw is required so that the container for the table does not increase in width with the table*/}
      <Box overflowX="auto" maxWidth="100vw" position="relative">
        {/*The loading overlay*/}
        {isLoading && (
          <Box position="absolute" zIndex={1} backgroundColor="rgba(0,0,0,0.05)" width="100%" height="100%"></Box>
        )}
        {/*The table*/}
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
            {data.length == 0 && !isLoading && <NoResults onResetQueryForm={onResetQueryForm} />}
            {data.length == 0 && <SkeletonResults nRows={8} />}
          </Tbody>
        </Table>
      </Box>
      <Flex
        w="full"
        alignItems="center"
        align="center"
        justifyContent="space-between"
        flexDirection={{ base: "column", sm: "row" }}
        p={{ base: "25px 15px 30px", sm: "16px 30px 50px" }}
      >
        <Pagination
          totalRows={queryResult.nItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={queryResult.limit}
        />
        <Text textStyle="lastUpdated" mt={{ base: "18px", sm: 0 }}>
          Data updated {lastUpdated}
        </Text>
      </Flex>
    </Box>
  );
};

export default memo(IndexTable);
