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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Entity } from "../lib/model";
import { getIndexTableData, getStatsData } from "../lib/api";
import React, { useEffect } from "react";
import IndexTable from "../components/IndexTable";
import Icon from "../components/Icon";
import TextCollapse from "../components/TextCollapse";
import Breadcrumb from "../components/Breadcrumb";
import Head from "next/head";

type Props = {
  countriesFirstPage: Array<Entity>;
  institutionsFirstPage: Array<Entity>;
  stats: any;
};

const maxTabsWidth = "970px";
const maxPageSize = 18;

const IndexPage = ({
  countriesFirstPage,
  institutionsFirstPage,
  stats,
}: Props) => {
  // Descriptions
  const descriptions = [
    {
      short: `Open Access by country between ${stats.min_year} and ${stats.max_year}.`,
      long:
        "Open Access by country. Showing output counts, number and percentage of accessible outputs published " +
        `between ${stats.min_year} and ${stats.max_year}. You can sort and filter by region, subregion, number of ` +
        "publications, and open access levels. You may also search for a specific country in the search bar at the top right.",
    },
    {
      short: `Open Access by institution between ${stats.min_year} and ${stats.max_year}.`,
      long:
        "Open Access by institution. Showing output counts, number and percentage of accessible outputs published " +
        `between ${stats.min_year} to ${stats.max_year}. You can sort and filter by region, subregion, country, institution type, number of ` +
        "publications or open access levels. You may also search for a specific institution in the search bar at the top right.",
    },
  ];

  // Change text based on tab index
  const defaultTabIndex = 0;
  const [tabIndex, setTabIndex] = React.useState(defaultTabIndex);
  const [dashboardText, setDashboardText] = React.useState(
    descriptions[defaultTabIndex]
  );
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    setDashboardText(descriptions[index]);
  };

  // Fetch and update country and institution list on client
  const [countries, setCountries] =
    React.useState<Array<Entity>>(countriesFirstPage);
  const [institutions, setInstitutions] = React.useState<Array<Entity>>(
    institutionsFirstPage
  );
  useEffect(() => {
    fetch("/data/country.json")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });
  }, []);
  useEffect(() => {
    fetch("/data/institution.json")
      .then((res) => res.json())
      .then((data) => {
        setInstitutions(data);
      });
  }, []);

  return (
    <Box
      width={{ base: "full", std: maxTabsWidth }}
      m={{ base: 0, md: "25px auto 0", std: "25px 40px 90px" }}
    >
      <Head>
        <title>COKI: Open Access Dashboard</title>
        <meta
          name="description"
          content="How Open is Academia? See how well your university or country performs at open access publishing."
        />
      </Head>

      <Box
        display={{ base: "none", md: "block" }}
        p={{
          base: 0,
          md: "24px 24px 0px",
          std: "24px 0 15px",
        }}
      >
        <Breadcrumb labelsToUppercase />
      </Box>
      <Box
        p={{ base: "24px 24px 15px", md: "24px 24px 15px", std: 0 }}
        bg="grey.200"
      >
        <Text textStyle="homeHeader">Open Access Dashboard</Text>
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
        isFitted
        variant="dashboard"
        bg="white"
        index={tabIndex}
        onChange={handleTabsChange}
        defaultIndex={0}
      >
        <TabList>
          <Tab>
            <Icon icon="website" size={24} marginRight="6px" />
            <Text>Country</Text>
          </Tab>
          <Tab>
            <Icon icon="institution" size={24} marginRight="6px" />
            <Text>Institution</Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <IndexTable
              entities={countries}
              categoryName="Country"
              maxPageSize={maxPageSize}
              lastUpdated={stats.last_updated}
            />
          </TabPanel>
          <TabPanel p={0}>
            <IndexTable
              entities={institutions}
              categoryName="Institution"
              maxPageSize={maxPageSize}
              lastUpdated={stats.last_updated}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export async function getStaticProps() {
  const countriesFirstPage = getIndexTableData("country").slice(0, maxPageSize);
  const institutionsFirstPage = getIndexTableData("institution").slice(
    0,
    maxPageSize
  );
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
