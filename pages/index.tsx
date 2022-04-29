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

import { Box, Grid, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { Entity } from "../lib/model";
import { getIndexTableData, getStatsData } from "../lib/api";
import React, { useEffect } from "react";
import IndexTable from "../components/IndexTable";
import Icon from "../components/Icon";
import TableFilter from "../components/TableFilter";
import TextCollapse from "../components/TextCollapse";
import Head from "next/head";
import Breadcrumbs from "../components/Breadcrumbs";

type Props = {
  countriesFirstPage: Array<Entity>;
  institutionsFirstPage: Array<Entity>;
  stats: any;
};

const maxTabsWidth = "1100px";
const maxPageSize = 18;

const IndexPage = ({ countriesFirstPage, institutionsFirstPage, stats }: Props) => {
  // Descriptions
  const descriptions = [
    {
      short: `Open Access by country between ${stats.start_year} and ${stats.end_year}.`,
      long:
        "Open Access by country. Showing output counts, number and percentage of accessible outputs published " +
        `between ${stats.start_year} and ${stats.end_year}. You can sort and filter by region, subregion, number of ` +
        "publications, and open access levels. You may also search for a specific country in the search bar at the top right.",
    },
    {
      short: `Open Access by institution between ${stats.start_year} and ${stats.end_year}.`,
      long:
        "Open Access by institution. Showing output counts, number and percentage of accessible outputs published " +
        `between ${stats.start_year} to ${stats.end_year}. You can sort and filter by region, subregion, country, institution type, number of ` +
        "publications or open access levels. You may also search for a specific institution in the search bar at the top right.",
    },
  ];

  const defaultTabIndex = 0;
  const [tabIndex, setTabIndex] = React.useState(defaultTabIndex);
  const [dashboardText, setDashboardText] = React.useState(descriptions[tabIndex]);
  const mapPathTabIndex: Array<string> = ["country", "institution"];

  // Set tab index and change text based on tab index
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    setDashboardText(descriptions[index]);
    const historyState = window.history.state;
    if (historyState.as === "/country/" || historyState.as === "/institution/") {
      window.history.replaceState(historyState, "", `/${mapPathTabIndex[index]}/`);
    }
  };

  // Change tab index and text based on pathname
  useEffect(() => {
    let index = mapPathTabIndex.indexOf(window.location.pathname.slice(1, -1));
    if (index === -1) {
      index = defaultTabIndex;
    }
    handleTabsChange(index);
  }, []);

  const [sortParams, setSortParams] = React.useState("orderBy=stats.p_outputs_open&orderDir=dsc");
  const [pageParams, setPageParams] = React.useState("page=0");
  const [filterParams, setFilterParams] = React.useState("");

  const [searchParams, setSearchParams] = React.useState("?page=1&orderBy=stats.p_outputs_open&orderDir=dsc");
  useEffect(() => {
    let value = `?${pageParams}&${sortParams}`;
    if (filterParams) {
      value = value + `&${filterParams}`;
    }
    setSearchParams(value);
  }, [sortParams, filterParams, pageParams]);

  return (
    <Box m={{ base: 0, md: "25px auto 0", std: "25px 40px 90px" }}>
      <Head>
        <title>COKI: Open Access Dashboard</title>
        <meta
          name="description"
          content="How Open is Academia? See how well your university or country performs at open access publishing."
        />
      </Head>

      <Breadcrumbs
        breadcrumbs={[]}
        p={{
          base: 0,
          md: "12.5px 12px 0px",
          std: "12.5px 0 15px",
        }}
      />

      <Grid
        maxWidth={{ base: "full", std: maxTabsWidth }}
        templateAreas={{ base: `"header" "table" "filter"`, std: `"header ." "table filter" "table filter"` }}
        templateColumns={{ std: `75% 25%` }}
        columnGap={"20px"}
      >
        <Box gridArea="header" p={{ base: "24px 24px 15px", md: "24px 24px 15px", std: 0 }} bg="grey.200">
          <Text as="h1" textStyle="homeHeader">
            Open Access Dashboard
          </Text>
          <Text textStyle="p" display={{ base: "none", sm: "none", md: "block" }}>
            {dashboardText.long}
          </Text>
          <TextCollapse
            display={{ base: "block", sm: "block", md: "none" }}
            previewText={dashboardText.short}
            text={dashboardText.long}
          />
        </Box>

        <Tabs
          gridArea="table"
          isFitted
          variant="dashboard"
          bg="white"
          index={tabIndex}
          onChange={handleTabsChange}
          defaultIndex={0}
          boxShadow={{ base: "none", md: "md" }}
          rounded="md"
          overflow="hidden"
        >
          <TabList>
            <Tab data-test="tab-country">
              <Icon icon="website" size={24} marginRight="6px" />
              <Text>Country</Text>
            </Tab>
            <Tab data-test="tab-institution">
              <Icon icon="institution" size={24} marginRight="6px" />
              <Text>Institution</Text>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <IndexTable
                firstPage={countriesFirstPage}
                categoryName="Country"
                maxPageSize={maxPageSize}
                lastUpdated={stats.last_updated}
                searchParams={searchParams}
                setSortParams={setSortParams}
                setPageParams={setPageParams}
              />
            </TabPanel>
            <TabPanel p={0}>
              <IndexTable
                firstPage={institutionsFirstPage}
                categoryName="Institution"
                maxPageSize={maxPageSize}
                lastUpdated={stats.last_updated}
                searchParams={searchParams}
                setSortParams={setSortParams}
                setPageParams={setPageParams}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box gridArea="filter">
          <TableFilter tabIndex={tabIndex} setFilterParams={setFilterParams} />
        </Box>
      </Grid>
    </Box>
  );
};

export async function getStaticProps() {
  const countriesFirstPage = getIndexTableData("country").slice(0, maxPageSize);
  const institutionsFirstPage = getIndexTableData("institution").slice(0, maxPageSize);
  const stats = getStatsData();
  return {
    props: {
      countriesFirstPage: countriesFirstPage,
      institutionsFirstPage: institutionsFirstPage,
      stats: stats,
    },
  };
}

export default IndexPage;
