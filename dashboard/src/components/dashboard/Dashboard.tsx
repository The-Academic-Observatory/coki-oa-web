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

import { Breadcrumbs, Head, Icon, PageLoader, TextCollapse } from "@/components/common";
import { FilterForm, institutionTypes, OpenAccess, QueryForm, regions } from "@/components/filter";
import { IndexTable } from "@/components/table";
import { cokiImageLoader, makeFilterParams, OADataAPI } from "@/lib/api";
import { useEffectAfterRender } from "@/lib/hooks";
import { Entity, EntityStats, QueryParams, QueryResult, Stats } from "@/lib/model";
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
  useMediaQuery,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

const MAX_TABS_WIDTH = "1100px";
const DEFAULT_PAGE_VALUES = {
  page: 0,
  limit: 18, // TODO: make sure this value is used in workers-api
  orderBy: "stats.p_outputs_open",
  orderDir: "dsc",
};

export const queryFormToQueryParams = (
  queryForm: QueryForm,
  removeDefaultValues: QueryParams | null = null,
): QueryParams => {
  const q: QueryParams = {
    // Set page values
    page: queryForm.page.page,
    limit: queryForm.page.limit,
    orderBy: queryForm.page.orderBy.replace("stats.", ""), // Remove stats. as nested fields are not used by the API,
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

  // Remove default values
  if (removeDefaultValues != null) {
    for (const key of Object.keys(q)) {
      if (removeDefaultValues[key] === q[key]) {
        delete q[key];
      }
    }
  }

  return q;
};

function makeDefaultOpenAccessValues(entityStats: EntityStats): OpenAccess {
  return {
    minPOutputsOpen: entityStats.min.p_outputs_open,
    maxPOutputsOpen: entityStats.max.p_outputs_open,
    minNOutputs: entityStats.min.n_outputs, //Replace with DEFAULT_N_OUTPUTS
    maxNOutputs: entityStats.max.n_outputs,
    minNOutputsOpen: entityStats.min.n_outputs_open,
    maxNOutputsOpen: entityStats.max.n_outputs_open,
  };
}

export const makeDefaultValues = (entityStats: EntityStats): QueryForm => {
  const defaults: QueryForm = {
    page: DEFAULT_PAGE_VALUES,
    region: {},
    subregion: {},
    institutionType: {},
    openAccess: makeDefaultOpenAccessValues(entityStats),
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
  entityType: string,
  initialState: QueryResult,
  entityStats: EntityStats,
): [QueryResult, QueryForm, (q: QueryForm) => void, QueryForm, boolean, number, () => void, OpenAccess] => {
  const router = useRouter();
  const defaultQueryForm = React.useMemo(() => makeDefaultValues(entityStats), [entityStats]);
  const rangeSliderMinMaxValues = React.useMemo(() => makeDefaultOpenAccessValues(entityStats), [entityStats]);
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
    const removeDefaultValues = {
      ...DEFAULT_PAGE_VALUES,
      subregions: [],
      institutionTypes: [],
      ...makeDefaultOpenAccessValues(entityStats),
    };
    removeDefaultValues.orderBy = "p_outputs_open";
    const queryParams = queryFormToQueryParams(queryForm, removeDefaultValues);

    // Update URL
    const urlParams = makeFilterParams(entityType, queryParams);
    let url = entityType;
    if (urlParams.size) {
      url += `?${urlParams.toString()}`;
    }
    console.log(`New query params: ${url}`);
    router.push(url, undefined, { shallow: true }).then();

    // Make filter URL
    const client = new OADataAPI();
    client
      .getEntities(entityType, queryParams)
      .then((data) => {
        setEntities(data);
      })
      .then(() => {
        setLoading(false);
      });
  }, [entityType, queryForm]);

  return [
    entities,
    queryForm,
    setQueryForm,
    defaultQueryForm,
    isLoading,
    resetFormState,
    onResetQueryForm,
    rangeSliderMinMaxValues,
  ];
};

export type DashboardProps = {
  defaultEntityType: string;
  defaultCountries: QueryResult;
  defaultInstitutions: QueryResult;
  stats: Stats;
};

const Dashboard = ({ defaultEntityType, defaultCountries, defaultInstitutions, stats }: DashboardProps) => {
  const router = useRouter();
  console.log(`Query params: ${JSON.stringify(router.query)}`);

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

  const categoryToTabIndex: Array<string> = ["country", "institution"];
  const defaultTabIndex = categoryToTabIndex.indexOf(defaultEntityType);
  const [tabIndex, setTabIndex] = React.useState<number>(defaultTabIndex);
  const defaultDescription = descriptions[defaultTabIndex];
  const [dashboardText, setDashboardText] = React.useState(defaultDescription);

  // Set tab index and change text based on tab index
  const handleTabsChange = (index: number) => {
    const category = categoryToTabIndex[index];
    setTabIndex(index);
    setDashboardText(descriptions[index]);

    // If on the /country/ or /institution/ page then update the URL
    const historyState = window.history.state;
    if (historyState.as === "/country/" || historyState.as === "/institution/") {
      window.history.replaceState(historyState, "", `/${category}/`);
    }
  };

  // Country entity query
  const [
    countries,
    queryFormCountry,
    setQueryFormCountry,
    defaultQueryFormCountry,
    isLoadingCountry,
    resetFormStateCountry,
    onResetQueryFormCountry,
    countryRangeSliderMinMaxValues,
  ] = useEntityQuery("country", defaultCountries, stats.country);

  // Institution entity query
  const [
    institutions,
    queryFormInstitution,
    setQueryFormInstitution,
    defaultQueryFormInstitution,
    isLoadingInstitution,
    resetFormStateInstitution,
    onResetQueryFormInstitution,
    institutionRangeSliderMinMaxValues,
  ] = useEntityQuery("institution", defaultInstitutions, stats.institution);

  // Modal filters
  // TODO: useDisclosure causing index page to render twice: https://github.com/chakra-ui/chakra-ui/issues/5517
  const { isOpen: isOpenFilterCountry, onOpen: onOpenFilterCountry, onClose: onCloseFilterCountry } = useDisclosure();
  const {
    isOpen: isOpenFilterInstitution,
    onOpen: onOpenFilterInstitution,
    onClose: onCloseFilterInstitution,
  } = useDisclosure();

  // Close modal filters when md screen size or above
  const [isMd] = useMediaQuery("(min-width: 1000px)");
  useEffect(() => {
    if (isMd) {
      onCloseFilterCountry();
      onCloseFilterInstitution();
    }
  }, [isMd]);

  const title = "COKI Open Access Dashboard";
  const description =
    "How Open is Academia? See how well your university or country performs at open access publishing.";

  return (
    <Box m={{ base: 0, md: "25px 25px 90px", std: "25px 40px 90px" }}>
      <PageLoader isLoading={isLoadingCountry || isLoadingInstitution} />

      {/* This component contains the Head tag for the page. */}
      <Head title={title} description={description}>
        {/* Preload the first page of country and institution logos */}
        {defaultCountries.items.map((e: Entity) => (
          <link key={`${e.id}-logo-sm-preload`} rel="preload" href={cokiImageLoader(e.logo_sm)} as="image" />
        ))}
        {defaultInstitutions.items.map((e: Entity) => (
          <link key={`${e.id}-logo-sm-preload`} rel="preload" href={cokiImageLoader(e.logo_sm)} as="image" />
        ))}
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
        maxWidth={{ base: "full", std: MAX_TABS_WIDTH }}
        templateAreas={`"header ."
                        "table filter"
                        ". filter"`} // The last template area means that the filters can expand past the table
        templateColumns={{ base: "100%", md: `3fr 1fr` }}
        gridAutoRows="minmax(min-content, max-content)" // Makes rows height of content
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
              data-test="tab-filter-button"
              variant="filterTab"
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
                entityTypeName="Country"
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
                entityTypeName="Institution"
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
            platform="desktop"
            queryForm={queryFormCountry}
            setQueryForm={setQueryFormCountry}
            defaultQueryForm={defaultQueryFormCountry}
            entityStats={stats.country}
            resetFormState={resetFormStateCountry}
            rangeSliderMinMaxValues={countryRangeSliderMinMaxValues}
          />
        </Box>

        <Box gridArea="filter" display={{ base: "none", md: tabIndex === 1 ? "block" : "none" }}>
          <FilterForm
            category="institution"
            platform="desktop"
            queryForm={queryFormInstitution}
            setQueryForm={setQueryFormInstitution}
            defaultQueryForm={defaultQueryFormInstitution}
            resetFormState={resetFormStateInstitution}
            entityStats={stats.institution}
            rangeSliderMinMaxValues={institutionRangeSliderMinMaxValues}
          />
        </Box>

        <Modal variant="filterModal" onClose={onCloseFilterCountry} size="full" isOpen={isOpenFilterCountry}>
          <ModalContent display={{ base: "flex", md: "none" }}>
            <ModalBody>
              <FilterForm
                category="country"
                platform="mobile"
                queryForm={queryFormCountry}
                setQueryForm={setQueryFormCountry}
                defaultQueryForm={defaultQueryFormCountry}
                entityStats={stats.country}
                resetFormState={resetFormStateCountry}
                onClose={onCloseFilterCountry}
                rangeSliderMinMaxValues={countryRangeSliderMinMaxValues}
                title="Country Filters"
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal variant="filterModal" onClose={onCloseFilterInstitution} size="full" isOpen={isOpenFilterInstitution}>
          <ModalContent display={{ base: "flex", md: "none" }}>
            <ModalBody>
              <FilterForm
                category="institution"
                platform="mobile"
                queryForm={queryFormInstitution}
                setQueryForm={setQueryFormInstitution}
                defaultQueryForm={defaultQueryFormInstitution}
                entityStats={stats.institution}
                resetFormState={resetFormStateInstitution}
                onClose={onCloseFilterInstitution}
                rangeSliderMinMaxValues={institutionRangeSliderMinMaxValues}
                title="Institution Filters"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Grid>
    </Box>
  );
};

export async function getDashboardStaticProps() {
  // Fetch data via the API rather than locally to make sure that it is ordered in the same way as filtering API
  const client = new OADataAPI();
  const stats = client.getStats();
  const countryQuery = queryFormToQueryParams(makeDefaultValues(stats.country));
  const countries = await client.getEntities("country", countryQuery);
  const institutionQuery = queryFormToQueryParams(makeDefaultValues(stats.institution));
  const institutions = await client.getEntities("institution", institutionQuery);

  return {
    props: {
      defaultCountries: countries,
      defaultInstitutions: institutions,
      stats: stats,
    },
  };
}

export default Dashboard;
