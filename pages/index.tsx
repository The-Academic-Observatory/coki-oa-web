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
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalContent,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { EntityStats, QueryParams, QueryResult, Stats } from "../lib/model";
import { getIndexTableData, getStatsData, makeFilterUrl } from "../lib/api";
import React, { useCallback, useEffect } from "react";
import IndexTable from "../components/table/IndexTable";
import Icon from "../components/common/Icon";
import FilterForm, { QueryForm } from "../components/filter/FilterForm";
import TextCollapse from "../components/common/TextCollapse";
import Head from "next/head";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { institutionTypes } from "../components/filter/InstitutionTypeForm";
import { regions } from "../components/filter/RegionForm";
import { useEffectAfterRender } from "../lib/hooks";
import PageLoader from "../components/common/PageLoader";

const maxTabsWidth = "1100px";
const maxPageSize = 18;

type Props = {
  countriesInitialState: QueryResult;
  institutionsInitialState: QueryResult;
  stats: Stats;
};

export const queryFormToQueryParams = (queryForm: QueryForm): QueryParams => {
  const q = {
    // Set page values
    page: queryForm.page.page,
    limit: queryForm.page.limit,
    orderBy: queryForm.page.orderBy,
    orderDir: queryForm.page.orderDir,

    // Default arrays
    subregions: new Array<string>(),
    institutionTypes: new Array<string>(),

    // Set publication and open access values
    minNOutputs: Math.round(queryForm.openAccess.minNOutputs),
    maxNOutputs: Math.round(queryForm.openAccess.maxNOutputs),
    minNOutputsOpen: Math.round(queryForm.openAccess.minNOutputsOpen),
    maxNOutputsOpen: Math.round(queryForm.openAccess.maxNOutputsOpen),
    minPOutputsOpen: Math.round(queryForm.openAccess.minPOutputsOpen),
    maxPOutputsOpen: Math.round(queryForm.openAccess.maxPOutputsOpen),
  };

  // Set subregions keys that are true
  q.subregions = Object.keys(queryForm.subregion).filter((key) => {
    return queryForm.subregion[key];
  });

  // Set institution types
  q.institutionTypes = Object.keys(queryForm.institutionType).filter((key) => {
    return queryForm.institutionType[key];
  });

  return q;
};

export const makeDefaultValues = (entityStats: EntityStats): QueryForm => {
  const defaults: QueryForm = {
    page: {
      page: 0,
      limit: 18,
      orderBy: "stats.p_outputs_open",
      orderDir: "dsc",
    },
    region: {},
    subregion: {},
    institutionType: {},
    openAccess: {
      minPOutputsOpen: entityStats.min.p_outputs_open,
      maxPOutputsOpen: entityStats.max.p_outputs_open,
      minNOutputs: entityStats.min.n_outputs,
      maxNOutputs: entityStats.max.n_outputs,
      minNOutputsOpen: entityStats.min.n_outputs_open,
      maxNOutputsOpen: entityStats.max.n_outputs_open,
    },
  };

  // Default region and subregion values
  Object.keys(regions).map((region) => {
    defaults.region[region] = false;
    for (let subregion of regions[region]) {
      defaults.subregion[subregion] = false;
    }
  });

  // Default institutionType values
  institutionTypes.map((institutionType) => {
    defaults.institutionType[institutionType] = false;
  });

  return defaults;
};

const useEntityQuery = (
  endpoint: string,
  initialState: QueryResult,
  entityStats: EntityStats,
): [QueryResult, QueryForm, (q: QueryForm) => void, QueryForm, boolean, number, () => void] => {
  const defaultQueryForm = React.useMemo(() => makeDefaultValues(entityStats), [entityStats]);
  const [entities, setEntities] = React.useState<QueryResult>(initialState);
  const [queryForm, setQueryForm] = React.useState<QueryForm>(defaultQueryForm);
  const [resetFormState, setResetFormState] = React.useState(0);
  const onResetQueryForm = useCallback(() => {
    setResetFormState((state) => state + 1);
  }, []);

  const [isLoading, setLoading] = React.useState<boolean>(false);
  useEffectAfterRender(() => {
    setLoading(true);

    // QueryForm to QueryParams
    const queryParams = queryFormToQueryParams(queryForm);

    // Make filter URL
    const url = makeFilterUrl(endpoint, queryParams);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setEntities(data);
      })
      .then(() => {
        setLoading(false);
      });
  }, [endpoint, queryForm]);

  return [entities, queryForm, setQueryForm, defaultQueryForm, isLoading, resetFormState, onResetQueryForm];
};

const IndexPage = ({ countriesInitialState, institutionsInitialState, stats }: Props) => {
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

  // Country entity query
  const [
    countries,
    queryFormCountry,
    setQueryFormCountry,
    defaultQueryFormCountry,
    isLoadingCountry,
    resetFormStateCountry,
    onResetQueryFormCountry,
  ] = useEntityQuery("countries", countriesInitialState, stats.country);

  // Institution entity query
  const [
    institutions,
    queryFormInstitution,
    setQueryFormInstitution,
    defaultQueryFormInstitution,
    isLoadingInstitution,
    resetFormStateInstitution,
    onResetQueryFormInstitution,
  ] = useEntityQuery("institutions", institutionsInitialState, stats.institution);

  // Modal filters
  // TODO: useDisclosure causing index page to render twice: https://github.com/chakra-ui/chakra-ui/issues/5517
  const { isOpen: isOpenFilterCountry, onOpen: onOpenFilterCountry, onClose: onCloseFilterCountry } = useDisclosure();
  const {
    isOpen: isOpenFilterInstitution,
    onOpen: onOpenFilterInstitution,
    onClose: onCloseFilterInstitution,
  } = useDisclosure();

  return (
    <Box m={{ base: 0, md: "25px 25px 0", std: "25px 40px 90px" }}>
      <PageLoader isLoading={isLoadingCountry || isLoadingInstitution} />

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
          md: "12.5px 0 0px",
          std: "12.5px 0 15px",
        }}
      />

      {/*Use free space units for grid so that column gap doesn't cause an overflow */}
      <Grid
        maxWidth={{ base: "full", std: maxTabsWidth }}
        templateAreas={{ base: `"header ." "table filter" ". filter"` }}
        templateColumns={{ base: "100%", md: `3fr 1fr` }}
        columnGap={`20px`}
      >
        <Box gridArea="header" p={{ base: "24px 24px 15px", md: "24px 0 15px", std: 0 }} bg="grey.200">
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
          overflow="hidden"
        >
          <TabList>
            <Tab data-test="tab-country">
              <Icon icon="website" size={24} marginRight="6px" />
              <Text fontSize={{ base: "14px", sm: "16px" }}>Country</Text>
            </Tab>
            <Tab data-test="tab-institution">
              <Icon icon="institution" size={24} marginRight="6px" />
              <Text fontSize={{ base: "14px", sm: "16px" }}>Institution</Text>
            </Tab>
            <Button
              variant="tabButton"
              display={{ base: "flex", md: "none" }}
              onClick={() => {
                // Open filter modal
                if (tabIndex == 0) {
                  onOpenFilterCountry();
                } else if (tabIndex == 1) {
                  onOpenFilterInstitution();
                }
              }}
            >
              <Icon icon="filter" color="white" size={24} marginRight={{ base: 0, sm: "6px" }} />
              <Text color="white" display={{ base: "none", sm: "block" }}>
                Filters
              </Text>
            </Button>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <IndexTable
                categoryName="Country"
                queryResult={countries}
                queryForm={queryFormCountry}
                setQueryForm={setQueryFormCountry}
                lastUpdated={stats.last_updated}
                isLoading={isLoadingCountry}
                onResetQueryForm={onResetQueryFormCountry}
              />
            </TabPanel>
            <TabPanel p={0}>
              <IndexTable
                categoryName="Institution"
                queryResult={institutions}
                queryForm={queryFormInstitution}
                setQueryForm={setQueryFormInstitution}
                lastUpdated={stats.last_updated}
                isLoading={isLoadingInstitution}
                onResetQueryForm={onResetQueryFormInstitution}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box gridArea="filter" display={{ base: "none", md: tabIndex === 0 ? "block" : "none" }}>
          <FilterForm
            category="country"
            queryForm={queryFormCountry}
            setQueryForm={setQueryFormCountry}
            defaultQueryForm={defaultQueryFormCountry}
            entityStats={stats.country}
            resetFormState={resetFormStateCountry}
          />
        </Box>
        <Box gridArea="filter" display={{ base: "none", md: tabIndex === 1 ? "block" : "none" }}>
          <FilterForm
            category="institution"
            queryForm={queryFormInstitution}
            setQueryForm={setQueryFormInstitution}
            defaultQueryForm={defaultQueryFormInstitution}
            resetFormState={resetFormStateInstitution}
            entityStats={stats.institution}
          />
        </Box>

        <Modal variant="filterModal" onClose={onCloseFilterCountry} size="full" isOpen={isOpenFilterCountry}>
          <ModalContent>
            <ModalBody>
              <FilterForm
                category="country"
                queryForm={queryFormCountry}
                setQueryForm={setQueryFormCountry}
                defaultQueryForm={defaultQueryFormCountry}
                entityStats={stats.country}
                resetFormState={resetFormStateCountry}
                onClose={onCloseFilterCountry}
                title="Country Filters"
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal variant="filterModal" onClose={onCloseFilterInstitution} size="full" isOpen={isOpenFilterInstitution}>
          <ModalContent>
            <ModalBody>
              <FilterForm
                category="institution"
                queryForm={queryFormInstitution}
                setQueryForm={setQueryFormInstitution}
                defaultQueryForm={defaultQueryFormInstitution}
                entityStats={stats.institution}
                resetFormState={resetFormStateInstitution}
                onClose={onCloseFilterInstitution}
                title="Institution Filters"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Grid>
    </Box>
  );
};

export async function getStaticProps() {
  const countries = getIndexTableData("country");
  const institutions = getIndexTableData("institution");
  const stats = getStatsData();
  const defaultQueryResult = {
    page: 0,
    limit: maxPageSize,
  };

  return {
    props: {
      countriesInitialState: {
        ...defaultQueryResult,
        items: countries.slice(0, maxPageSize),
        nItems: countries.length,
      },
      institutionsInitialState: {
        ...defaultQueryResult,
        items: institutions.slice(0, maxPageSize),
        nItems: institutions.length,
      },
      stats: stats,
    },
  };
}

export default IndexPage;
