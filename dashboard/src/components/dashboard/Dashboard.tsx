// Copyright 2022-2024 Curtin University
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
import { FilterForm, institutionTypes, OpenAccess, QueryForm } from "@/components/filter";
import { Node } from "@/components/common/CheckboxTree";
import { IndexTable } from "@/components/table";
import { cokiImageLoader, OADataAPI } from "@/lib/api";
import { useEffectAfterRender } from "@/lib/hooks";
import { Entity, EntityStats, QueryParams, QueryResult, Stats } from "@/lib/model";
import {
  Box,
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalContent,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import lodashSet from "lodash.set";
import React, { useCallback, useEffect } from "react";

const MAX_TABS_WIDTH = "1150px";
const MAX_PAGE_SIZE = 18;
export const DEFAULT_N_OUTPUTS = 1000;

// New checkboxTree object that holds all the regions and subregions in a tree-like structure.
export let NODES = [
  new Node("region", "Africa", [new Node("subregion", "Northern Africa"), new Node("subregion", "Sub-Saharan Africa")]),
  new Node("region", "Americas", [
    new Node("subregion", "Latin America and the Caribbean"),
    new Node("subregion", "Northern America"),
  ]),
  new Node("region", "Asia", [
    new Node("subregion", "Central Asia"),
    new Node("subregion", "Eastern Asia"),
    new Node("subregion", "South-eastern Asia"),
    new Node("subregion", "Southern Asia"),
    new Node("subregion", "Western Asia"),
  ]),
  new Node("region", "Europe", [
    new Node("subregion", "Eastern Europe"),
    new Node("subregion", "Northern Europe"),
    new Node("subregion", "Southern Europe"),
    new Node("subregion", "Western Europe"),
  ]),
  new Node("region", "Oceania", [
    new Node("subregion", "Australia and New Zealand"),
    new Node("subregion", "Melanesia"),
    new Node("subregion", "Micronesia"),
    new Node("subregion", "Polynesia"),
  ]),
];

export const queryFormToQueryParams = (queryForm: QueryForm): QueryParams => {
  const q = {
    // Set page values
    page: queryForm.page.page,
    limit: queryForm.page.limit,
    orderBy: queryForm.page.orderBy,
    orderDir: queryForm.page.orderDir,

    // Default arrays
    ids: queryForm.ids.map((o) => o.value), // For individual country and institution filtering
    countries: queryForm.countries.map((o) => o.value), // For filtering institutions by country code
    subregions: new Array<string>(),
    institutionTypes: new Array<string>(),

    // Set publication and open access values
    minNOutputs: queryForm.openAccess.minNOutputs,
    maxNOutputs: queryForm.openAccess.maxNOutputs,
    minNOutputsOpen: queryForm.openAccess.minNOutputsOpen,
    maxNOutputsOpen: queryForm.openAccess.maxNOutputsOpen,
    minPOutputsOpen: queryForm.openAccess.minPOutputsOpen,
    maxPOutputsOpen: queryForm.openAccess.maxPOutputsOpen,
  };

  // Set subregions keys that are true
  for (const region of Object.keys(queryForm.region)) {
    const subregions = queryForm.region[region].subregion;
    for (const subregion of Object.keys(subregions)) {
      if (subregions[subregion].value) {
        q.subregions.push(subregion);
      }
    }
  }

  // Set institution types
  q.institutionTypes = Object.keys(queryForm.institutionType).filter((key) => {
    return queryForm.institutionType[key];
  });

  return q;
};

export const makeOpenAccess = (entityStats: EntityStats): OpenAccess => {
  return {
    minPOutputsOpen: entityStats.min.p_outputs_open,
    maxPOutputsOpen: entityStats.max.p_outputs_open,
    minNOutputs: entityStats.min.n_outputs,
    maxNOutputs: entityStats.max.n_outputs,
    minNOutputsOpen: entityStats.min.n_outputs_open,
    maxNOutputsOpen: entityStats.max.n_outputs_open,
  };
};

const makeDefaultNodeValues = (nodes: Array<Node>) => {
  let defaults = {};

  for (const node of nodes) {
    // Set value for this node
    lodashSet(defaults, node.key(), false);

    // Set values for children
    for (const child of node.children) {
      lodashSet(defaults, child.key(), false);
    }
  }

  return defaults;
};

export const makeFormValues = (entityStats: EntityStats, minNOutputs?: number): QueryForm => {
  let defaults: QueryForm = {
    page: {
      page: 0,
      limit: MAX_PAGE_SIZE,
      orderBy: "oa_status.open.percent",
      orderDir: "dsc",
    },
    ids: [],
    countries: [],
    region: {},
    institutionType: {},
    openAccess: makeOpenAccess(entityStats),
  };

  // Set a different min value
  if (minNOutputs != null) {
    defaults.openAccess.minNOutputs = minNOutputs;
  }

  // Set region
  defaults = { ...defaults, ...makeDefaultNodeValues(NODES) };

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
  const startQueryForm = React.useMemo(() => makeFormValues(entityStats, DEFAULT_N_OUTPUTS), [entityStats]);
  const defaultQueryForm = React.useMemo(() => makeFormValues(entityStats), [entityStats]);
  const rangeSliderMinMaxValues = React.useMemo(() => makeOpenAccess(entityStats), [entityStats]);
  const [entities, setEntities] = React.useState<QueryResult>(initialState);
  const [queryForm, setQueryForm] = React.useState<QueryForm>(startQueryForm);
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
    const client = new OADataAPI();
    client
      .getEntities(entityType, queryParams)
      .then((response) => {
        setEntities(response.data);
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

function entityToTabIndex(entityType: string) {
  return ["country", "institution"].indexOf(entityType);
}

function tabIndexToEntity(tabIndex: number) {
  return { 0: "country", 1: "institution" }[tabIndex];
}

const Dashboard = ({ defaultEntityType, defaultCountries, defaultInstitutions, stats }: DashboardProps) => {
  // Descriptions
  const descriptions = [
    {
      short: `Open Access by country between ${stats.start_year} and ${stats.end_year}.`,
      long:
        "Open Access by country. Showing output counts, number and percentage of accessible outputs published " +
        `between ${stats.start_year} and ${stats.end_year}. You can sort and filter by region, subregion, number of ` +
        "publications (default filter is 1000 publications), and open access levels. You may also search for a specific country in the search bar at the top right.",
    },
    {
      short: `Open Access by institution between ${stats.start_year} and ${stats.end_year}.`,
      long:
        "Open Access by institution. Showing output counts, number and percentage of accessible outputs published " +
        `between ${stats.start_year} to ${stats.end_year}. You can sort and filter by region, subregion, number of ` +
        "publications (default filter is 1000 publications), open access levels and institution type. You may also search for a specific institution in the search bar at the top right.",
    },
  ];

  const defaultTabIndex = entityToTabIndex(defaultEntityType);
  const [tabIndex, setTabIndex] = React.useState<number>(defaultTabIndex);
  const defaultDescription = descriptions[defaultTabIndex];
  const [dashboardText, setDashboardText] = React.useState(defaultDescription);

  // Set tab index and change text based on tab index
  const handleTabsChange = (index: number) => {
    const entityType = tabIndexToEntity(index);
    setTabIndex(index);
    setDashboardText(descriptions[index]);

    // If on the /country/ or /institution/ page then update the URL
    const historyState = window.history.state;
    if (historyState.as === "/country/" || historyState.as === "/institution/") {
      window.history.replaceState(historyState, "", `/${entityType}/`);
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
            {/*We use Button rather than Tab, because Tab cannot be selected by default and it's styling wil flash */}
            <Button
              variant={tabIndexToEntity(tabIndex) === "country" ? "tabActive" : "tabInactive"}
              aria-selected={tabIndexToEntity(tabIndex) === "country"}
              data-test="tab-country"
              onClick={() => {
                setTabIndex(entityToTabIndex("country"));
              }}
            >
              <Icon icon="website" size={24} marginRight="6px" />
              <Text fontSize={{ base: "14px", sm: "16px" }}>Country</Text>
            </Button>

            <Button
              variant={tabIndexToEntity(tabIndex) === "institution" ? "tabActive" : "tabInactive"}
              aria-selected={tabIndexToEntity(tabIndex) === "institution"}
              data-test="tab-institution"
              onClick={() => {
                setTabIndex(entityToTabIndex("institution"));
              }}
            >
              <Icon icon="institution" size={24} marginRight="6px" />
              <Text fontSize={{ base: "14px", sm: "16px" }}>Institution</Text>
            </Button>

            <Button
              data-test="tab-filter-button"
              variant="filterTab"
              display={{ base: "flex", md: "none" }}
              onClick={() => {
                // Open filter modal
                if (tabIndex == entityToTabIndex("country")) {
                  onOpenFilterCountry();
                } else if (tabIndex == entityToTabIndex("institution")) {
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
            entityType="country"
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
            entityType="institution"
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
                entityType="country"
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
                entityType="institution"
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
  const countryQuery = queryFormToQueryParams(makeFormValues(stats.country, DEFAULT_N_OUTPUTS));
  const countries = (await client.getEntities("country", countryQuery)).data;
  const institutionQuery = queryFormToQueryParams(makeFormValues(stats.institution, DEFAULT_N_OUTPUTS));
  const institutions = (await client.getEntities("institution", institutionQuery)).data;

  return {
    props: {
      defaultCountries: countries,
      defaultInstitutions: institutions,
      stats: stats,
    },
  };
}

export default Dashboard;
