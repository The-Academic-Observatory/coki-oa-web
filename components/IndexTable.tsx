import {
    Box,
    Button,
    chakra,
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
    Tr
} from '@chakra-ui/react';
import React from 'react';
import {usePagination, useSortBy, useTable} from "react-table";
import {Entity} from "../lib/model";
import {ChevronLeftIcon, ChevronRightIcon, TriangleDownIcon, TriangleUpIcon} from '@chakra-ui/icons';
import DonutSparkline from "./DonutSparkline";
import BreakdownSparkline from "./BreakdownSparkline";
import Icon from "./Icon";
import Link from './Link';


function makeHref(category: string, id: string) {
    return `${category}/${id}`;
}

function EntityCell({value, entity}) {
    const href = makeHref(entity.category, entity.id);
    return (
        <Link href={href}>
            <a>
                <HStack>
                    <Image
                        rounded="full"
                        objectFit="cover"
                        boxSize='16px'
                        src={entity.logo}
                        alt={entity.name}
                    />
                    <Text>{entity.name}</Text>
                </HStack>
            </a>
        </Link>
    )
}

function OpenCell({value, entity}) {
    const href = makeHref(entity.category, entity.id);
    return (<Link href={href}><a><DonutSparkline value={value} color='#f47328' size={18}/></a></Link>)
}

function BreakdownCell({value, entity}) {
    const href = makeHref(entity.category, entity.id);
    const closed = entity.stats.n_outputs - entity.stats.n_outputs_open;
    const values = [entity.stats.n_outputs_publisher_open, entity.stats.n_outputs_other_platform_open_only, closed];
    const colors = ['#ffd700', '#9FD27E', '#EBEBEB'];
    return <Link href={href}><a><BreakdownSparkline values={values} colors={colors} width={110} height={17}/></a></Link>
}

function NumberCell({value, entity}) {
    return <span>{value.toLocaleString()}</span>
}

function LearnMoreCell({value, entity}) {
    const href = makeHref(entity.category, entity.id);
    return (
        <Link href={href}>
            <Button as="a" variant="dashboard" rightIcon={<Icon icon="arrow-right" color="white" size={12} />}>
                Learn More
            </Button>
        </Link>
    )
}

function BreakdownHeader({value, entity}) {
    return (
    <span>
            <Text>Breakdown</Text>
            <Text fontFamily="Brandon Grotesque Light"
                  fontSize={10}
                  lineHeight={1.2}
                  fontWeight={900}
                  color="grey.900">Publisher open <br/>other platform open <br/> closed <br /></Text>
        </span>
    )
}


type Props = {
    entities: Array<Entity>
    categoryName: string
}


const IndexTable = ({entities, categoryName}: Props) => {
    const data = entities;
    const columns = React.useMemo(
        () => [
            {
                Header: categoryName,
                accessor: 'name',
                Cell: EntityCell,
                minWidth: 220,
                maxWidth: 220
            },
            {
                Header: 'Open',
                accessor: 'stats.p_outputs_open',
                Cell: OpenCell
            },
            {
                Header: BreakdownHeader,
                id: 'breakdown',
                accessor: 'stats.p_outputs_open',
                Cell: BreakdownCell,
                minWidth: 170,
                maxWidth: 170
            },
            {
                Header: 'Total Publications',
                accessor: 'stats.n_outputs',
                Cell: NumberCell,
                isNumeric: true,
                minWidth: 150,
                maxWidth: 150
            },
            {
                Header: 'Open Publications',
                accessor: 'stats.n_outputs_open',
                Cell: NumberCell,
                isNumeric: true,
                minWidth: 150,
                maxWidth: 150
            },
            {
                Header: '',
                Cell: LearnMoreCell,
                id: 'learnMore',
                accessor: e => e
            },
        ],
        []
    )

    // const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
    //     useTable({columns, data}, useSortBy);

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
        state: {pageIndex, pageSize, sortBy}
    } = useTable(
        {
            columns,
            data,
            autoResetPage: false,
            autoResetSortBy: false,
            initialState: {pageIndex: 0, pageSize: 18}
        },
        useSortBy,
        usePagination,
    );

    let currentPageSize = pageSize;
    let pageSizeIncrement = pageSize;

    // setPageSize(10);

    return (
        <Box>
            <Box overflowX="auto">
                <Table {...getTableProps()} size={"sm"} variant="dashboard">
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
                                        {column.render('Header')}
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
                                    {/*<Link href={makeHref(row.original.category, row.original.id)}>*/}
                                        {row.cells.map((cell) => (
                                            <Td {...cell.getCellProps()}
                                                isNumeric={cell.column.isNumeric}
                                                minWidth={cell.column.minWidth}
                                                maxWidth={cell.column.maxWidth}>
                                                {cell.render('Cell', { entity: row.original})}
                                            </Td>
                                        ))}
                                    {/*</Link>*/}
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </Box>
            {/*<Flex alignItems="center" justifyContent='space-between' display={{base: 'flex', xl: 'none'}}>*/}
            {/*    <Button rounded={30} size="lg" onClick={() => {*/}
            {/*        currentPageSize += pageSizeIncrement;*/}
            {/*        setPageSize(currentPageSize)*/}
            {/*    }}>Load More</Button>*/}
            {/*    <Button rounded={30} size="lg">Filter</Button>*/}
            {/*</Flex>*/}
            {/*<Flex alignItems="center" justifyContent='space-between' display={{base: 'none', xl: 'flex'}}>*/}
            {/*    <HStack>*/}
            {/*        <IconButton aria-label='Previous Page' icon={<ChevronLeftIcon/>} onClick={() => previousPage()}*/}
            {/*                    disabled={!canPreviousPage}/>*/}
            {/*        <IconButton aria-label='Next Page' icon={<ChevronRightIcon/>} onClick={() => nextPage()}*/}
            {/*                    disabled={!canNextPage}/>*/}
            {/*    </HStack>*/}
            {/*    <Text>Last updated 21 November 2021</Text>*/}
            {/*</Flex>*/}
        </Box>
    )
};

export default IndexTable;