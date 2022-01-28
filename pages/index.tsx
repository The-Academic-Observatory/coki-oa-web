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
import { getIndexTableData } from "../lib/api";
import React, { useEffect } from "react";
import IndexTable from "../components/IndexTable";
import Icon from "../components/Icon";

type Props = {
  countriesFirstPage: Array<Entity>;
  institutionsFirstPage: Array<Entity>;
};

const maxTabsWidth = "970px";
const maxPageSize = 18;

const descriptions = [
  "Open Access by country. Showing output counts, number and proportion of accessible outputs published " +
    "between 1800 and 2021. You can sort and filter by region, subregion, number of publications, and open " +
    "access levels. You may also search for a specific country.",
  "Open Access by institution. Showing output counts, number and proportion of accessible outputs published " +
    "between 1800 to 2021. You can sort and filter by region, subregion, country, institution type, number of " +
    "publications or open access levels. You may also search for a specific institution.",
];

const IndexPage = ({ countriesFirstPage, institutionsFirstPage }: Props) => {
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
    fetch("/country.json")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });
  }, []);
  useEffect(() => {
    fetch("/institution.json")
      .then((res) => res.json())
      .then((data) => {
        setInstitutions(data);
      });
  }, []);

  return (
    <Box maxWidth={maxTabsWidth}>
      <Box p={{ base: "30px 30px 15px", md: 0 }}>
        <Text textStyle="homeHeader">Open Access Dashboard</Text>
        <Text className="myText" datacontent={dashboardText} textStyle="p">
          {dashboardText}
        </Text>
      </Box>

      <Tabs
        isFitted
        variant="dashboard"
        bg="white"
        index={tabIndex}
        onChange={handleTabsChange}
      >
        <TabList>
          <Tab href="/country">
            <Icon icon="website" size={24} marginRight="6px" />
            <Text>Country</Text>
          </Tab>
          <Tab href="/institution">
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
            />
          </TabPanel>
          <TabPanel p={0}>
            <IndexTable
              entities={institutions}
              categoryName="Institution"
              maxPageSize={maxPageSize}
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
  return {
    props: {
      countriesFirstPage: countriesFirstPage,
      institutionsFirstPage: institutionsFirstPage,
    },
  };
}

export default IndexPage;
