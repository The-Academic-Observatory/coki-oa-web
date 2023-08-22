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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  HStack,
  Skeleton,
  SkeletonCircle,
  VStack,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { Entity, Repository } from "../../lib/model";
import React, { memo } from "react";
import EntityCard from "./EntityCard";
import { Cell, ColumnInstance, Row, usePagination, useSortBy, useTable } from "react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Pagination from "../table/Pagination";
import { FaBriefcaseMedical, FaFirstdraft, FaUniversity, FaUsers } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { toReadableNumber } from "../../lib/utils";

export interface RepositoryProps {
  value: any;
  repo: Repository;
  max: number;
}

interface TopOtherPlatformOpenCardProps extends BoxProps {
  entity: Entity;
}

interface ColumnProps {
  column: ColumnInstance;
}

const ColumnHeaders: { [id: string]: string } = {
  name: "Name",
  category: "Platform Type",
  total_outputs: "Publications",
};

function Header({ column }: ColumnProps) {
  let justifyContent = "flex-start";
  if (column.isNumeric) {
    justifyContent = "flex-end";
  }
  return (
    <span>
      <Flex justifyContent={justifyContent}>
        <Text>{ColumnHeaders[column.id]}</Text>
        {column.isSorted ? (
          column.isSortedDesc ? (
            <ArrowDownIcon viewBox="0 -2 24 24" />
          ) : (
            <ArrowUpIcon viewBox="0 -2 24 24" />
          )
        ) : (
          <ArrowDownIcon viewBox="0 0 0 0" />
        )}
      </Flex>
    </span>
  );
}

function RepoCell({ value, repo, max }: RepositoryProps) {
  const percent = (repo.total_outputs / max) * 100;
  return (
    // Creates bars
    <Box
      p="8px"
      position="relative"
      _after={{
        content: '""',
        background: "rgba(159, 210, 126, 0.15)",
        position: "absolute",
        width: `${percent}%`,
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      {value}
    </Box>
  );
}

function PlatformTypeCell({ value }: RepositoryProps) {
  return (
    <Flex align="center">
      <Box mr="6px">
        {value === "Institution" && <FaUniversity color="#79a161" />}
        {value === "Preprint" && <FaFirstdraft color="#79a161" />}
        {value === "Domain" && <FaBriefcaseMedical color="#79a161" />}
        {value === "Public" && <FaUsers color="#79a161" />}
        {value === "Other Internet" && <TbWorld color="#79a161" />}
      </Box>
      <Box>{value}</Box>
    </Flex>
  );
}

function NumberCell({ value }: RepositoryProps) {
  return <span>{toReadableNumber(value)}</span>;
}

interface NoResultsProps {
  nRows: number;
  onlyHomeRepos: boolean;
  entity: Entity;
  onReset: () => void;
}

const NoResults = ({ nRows, onlyHomeRepos, entity, onReset }: NoResultsProps) => {
  const color = "rgb(226, 232, 240)";

  return (
    <>
      {Array.from(Array(nRows).keys()).map(key => {
        return (
          <Tr key={key} role="row" zIndex="1" data-test={key}>
            <Td role="cell">
              {/* Name */}
              <Skeleton startColor={color} endColor={color} height="32px" />
            </Td>
            <Td role="cell">
              {/* Type */}
              <HStack mr="1%">
                <SkeletonCircle startColor={color} endColor={color} size="24px" />
                <Skeleton startColor={color} endColor={color} height="24px" flex="1" />
              </HStack>
            </Td>
            <Td role="cell">
              {/*Publications*/}
              <Skeleton startColor={color} endColor={color} height="24px" />
            </Td>
          </Tr>
        );
      })}
      <Flex
        position="absolute"
        background="linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6937149859943977) 90%, rgba(255,255,255,0) 100%)"
        top={0}
        left={0}
        right={0}
        bottom={0}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <VStack mt={{ base: 0, sm: "48px" }}>
          {!onlyHomeRepos && (
            <>
              <Text as="p" fontSize="24px">
                No results
              </Text>
              <Text mt="0 !important" pb="32px" fontSize="18px">
                Try to change your filters
              </Text>{" "}
            </>
          )}
          {onlyHomeRepos && (
            <>
              <Box p={{ base: "0 12px 0 ", sm: "12px 12px 0" }}>
                <Text as="p" textStyle="detailTableText">
                  We did not find an institutional repository belonging to {entity.name}, this could be because:
                </Text>
                <UnorderedList textStyle="detailTableText">
                  <ListItem>We have not linked your repository correctly.</ListItem>
                  <ListItem>Your repository is not indexed by Unpaywall.</ListItem>
                  <ListItem>Your repository is behind a login wall, preventing it from being indexed.</ListItem>
                  <ListItem>Your organisation does not have an institutional repository.</ListItem>
                </UnorderedList>
                <Text as="p" textStyle="detailTableText">
                  <a href="https://forms.gle/9DaBBRipHcPrL3uE7" target="_blank" rel="noreferrer">
                    Submit a request
                  </a>{" "}
                  to add, correct or troubleshoot a repository.
                </Text>
              </Box>
            </>
          )}
          <Button variant="solid" onClick={onReset} height="26px" fontSize="12px" px="12px">
            Reset Filters
          </Button>
        </VStack>
      </Flex>
    </>
  );
};

const OtherPlatformLocationsCard = ({ entity, ...rest }: TopOtherPlatformOpenCardProps) => {
  const pageSize = 10;
  const platformTypes = ["Institution", "Preprint", "Domain", "Public", "Other Internet"];
  const columns = React.useMemo<Array<any>>(
    () => [
      {
        Header: Header,
        Cell: RepoCell,
        id: "name",
        accessor: "id",
        minWidth: "200px",
        width: "60%",
      },
      {
        Header: Header,
        id: "category",
        accessor: "category",
        width: "150px",
        Cell: PlatformTypeCell,
      },
      {
        Header: Header,
        id: "total_outputs",
        accessor: "total_outputs",
        isNumeric: true,
        Cell: NumberCell,
        sortDescFirst: true,
      },
    ],
    [],
  );

  const [maxPubs, setMaxPubs] = React.useState(0);
  const [platformType, setPlatformType] = React.useState("");
  const [onlyHomeRepos, setOnlyHomeRepos] = React.useState(false);
  const defaultSortBy = React.useMemo<Array<any>>(() => [{ id: "total_outputs", desc: true }], []);
  const data = React.useMemo(() => {
    let repos = [];
    let max = 0;
    for (let i = 0; i < entity.repositories.length; i++) {
      const repo = entity.repositories[i];

      // If onlyHomeRepos is true then only add home repos
      // If not just looking for home repos, then only add repos if platform type matches
      const include =
        (onlyHomeRepos && repo.home_repo) ||
        (!onlyHomeRepos && (platformType === "" || platformType === repo.category));

      if (include) {
        if (repo.total_outputs > max) {
          max = repo.total_outputs;
        }
        repos.push(repo);
      }
    }

    setMaxPubs(max);
    return repos;
  }, [entity.repositories, platformType, onlyHomeRepos]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: data,
      autoResetSortBy: false,
      disableSortRemove: true,
      initialState: {
        pageIndex: 0,
        pageSize: pageSize,
        sortBy: defaultSortBy,
      },
    },
    useSortBy,
    usePagination,
  );

  const onReset = () => {
    setPlatformType("");
    setOnlyHomeRepos(false);
  };

  return (
    <EntityCard width="full" {...rest}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" w="full">
          <Text textStyle="entityCardHeading">Other Platform Locations</Text>
          <Flex gap="12px" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <Button
              variant={platformType === "" && !onlyHomeRepos ? "buttonLinkSelected" : "buttonLink"}
              onClick={onReset}
            >
              All
            </Button>
            {/* Chakra Select can't be styled across platforms consistently as it uses the native HTML select, so use Menu instead */}
            <Menu variant="selectMenu">
              <MenuButton
                variant={platformType !== "" ? "buttonLinkSelected" : "buttonLink"}
                textAlign="right"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {platformType === "" && "Platform Type"}
                {platformType !== "" && platformType}
              </MenuButton>
              <MenuList>
                {platformTypes.map((type: string) => {
                  return (
                    <MenuItem
                      key={type}
                      onClick={() => {
                        setOnlyHomeRepos(false);
                        setPlatformType(type);
                      }}
                    >
                      {type}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            {entity.entity_type === "institution" && (
              <Button
                variant={onlyHomeRepos ? "buttonLinkSelected" : "buttonLink"}
                onClick={() => {
                  let newValue = !onlyHomeRepos;
                  setPlatformType("");
                  setOnlyHomeRepos(newValue);
                }}
              >
                Institution&#39;s Repositories
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Box overflowX="auto" maxWidth="100vw" position="relative" my="12px">
        <Table {...getTableProps()} size="sm" variant="details">
          <Thead>
            {headerGroups.map(headerGroup => {
              let props = headerGroup.getHeaderGroupProps();
              return (
                <Tr key={props.key}>
                  {headerGroup.headers.map((column: any) => {
                    const props = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <Th
                        key={props.key}
                        {...props}
                        isNumeric={column.isNumeric}
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
                        {cell.render("Cell", { repo: row.original, max: maxPubs })}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
            {data.length == 0 && (
              <NoResults nRows={10} entity={entity} onlyHomeRepos={onlyHomeRepos} onReset={onReset} />
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex mt="12px" justifyContent={{ base: "center", sm: "start" }}>
        <Pagination totalRows={data.length} currentPage={pageIndex} setCurrentPage={gotoPage} rowsPerPage={pageSize} />
      </Flex>
    </EntityCard>
  );
};

export default memo(OtherPlatformLocationsCard);
