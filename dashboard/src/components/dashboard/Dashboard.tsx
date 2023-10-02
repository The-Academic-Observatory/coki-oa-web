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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { parseAsArrayOf, parseAsFloat, parseAsInteger, parseAsString, useQueryState } from "next-usequerystate";
import React, { useCallback, useEffect } from "react";

const MAX_TABS_WIDTH = "1100px";

const queryParamsToQueryForm = (queryParams: QueryParams): QueryForm => {
  const form: QueryForm = {
    page: {
      page: queryParams.page as number,
      limit: queryParams.limit as number,
      orderBy: queryParams.orderBy as string,
      orderDir: queryParams.orderDir as string,
    },
    region: {},
    subregion: {},
    institutionType: {},
    openAccess: {
      minNOutputs: queryParams.minNOutputs as number,
      maxNOutputs: queryParams.maxNOutputs as number,
      minNOutputsOpen: queryParams.minNOutputsOpen as number,
      maxNOutputsOpen: queryParams.maxNOutputsOpen as number,
      minPOutputsOpen: queryParams.minPOutputsOpen as number,
      maxPOutputsOpen: queryParams.maxPOutputsOpen as number,
    },
  };

  // Default region and subregion values
  Object.keys(regions).map((region) => {
    form.region[region] = false;
    for (let subregion of regions[region]) {
      form.subregion[subregion] = false;
    }
  });

  // Default institutionType values
  institutionTypes.map((institutionType) => {
    form.institutionType[institutionType] = false;
  });

  // Add any true regions

  // Add any true subregions

  // Add any true institutionTypes

  return form;
};

export const queryFormToQueryParams = (
  queryForm: QueryForm,
  // removeDefaultValues: QueryParams | null = null,
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
    // TODO: remove rounding
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

  // // Remove default values
  // if (removeDefaultValues != null) {
  //   for (const key of Object.keys(q)) {
  //     if (removeDefaultValues[key] === q[key]) {
  //       delete q[key];
  //     }
  //   }
  // }

  return q;
};

export const makeDefaultQueryForm = (entityStats: EntityStats): QueryForm => {
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

export const makeRangeSliderMinMaxValues = (entityStats: EntityStats): OpenAccess => {
  return {
    minPOutputsOpen: entityStats.min.p_outputs_open,
    maxPOutputsOpen: entityStats.max.p_outputs_open,
    minNOutputs: entityStats.min.n_outputs,
    maxNOutputs: entityStats.max.n_outputs,
    minNOutputsOpen: entityStats.min.n_outputs_open,
    maxNOutputsOpen: entityStats.max.n_outputs_open,
  };
};

const useEntityQuery = (
  entityType: string,
  initialState: QueryResult,
  defaultQueryForm: QueryForm,
): [
  QueryResult,
  QueryForm,
  (value: ((prevState: QueryForm) => QueryForm) | QueryForm) => void,
  boolean,
  number,
  () => void,
] => {
  // URL query param state
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(defaultQueryForm.page.page));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(defaultQueryForm.page.limit));
  const [orderBy, setOrderBy] = useQueryState("orderBy", parseAsString.withDefault(defaultQueryForm.page.orderBy));
  const [orderDir, setOrderDir] = useQueryState("orderDir", parseAsString.withDefault(defaultQueryForm.page.orderDir));
  const [subregions, setSubregions] = useQueryState("subregions", parseAsArrayOf(parseAsString, ",").withDefault([]));
  const [minNOutputs, setMinNOutputs] = useQueryState(
    "minNOutputs",
    parseAsInteger.withDefault(defaultQueryForm.openAccess.minNOutputs),
  );
  const [maxNOutputs, setMaxNOutputs] = useQueryState(
    "maxNOutputs",
    parseAsInteger.withDefault(defaultQueryForm.openAccess.maxNOutputs),
  );
  const [minNOutputsOpen, setMinNOutputsOpen] = useQueryState(
    "minNOutputsOpen",
    parseAsInteger.withDefault(defaultQueryForm.openAccess.minNOutputsOpen),
  );
  const [maxNOutputsOpen, setMaxNOutputsOpen] = useQueryState(
    "maxNOutputsOpen",
    parseAsInteger.withDefault(defaultQueryForm.openAccess.maxNOutputsOpen),
  );
  const [minPOutputsOpen, setMinPOutputsOpen] = useQueryState(
    "minPOutputsOpen",
    parseAsFloat.withDefault(defaultQueryForm.openAccess.minPOutputsOpen),
  );
  const [maxPOutputsOpen, setMaxPOutputsOpen] = useQueryState(
    "maxPOutputsOpen",
    parseAsFloat.withDefault(defaultQueryForm.openAccess.maxPOutputsOpen),
  );

  const updateURLState = React.useCallback(
    (queryParams: QueryParams) => {
      setPage(queryParams.page as number);
      setLimit(queryParams.limit as number);
      setOrderBy(queryParams.orderBy as string);
      setOrderDir(queryParams.orderDir as string);
      setSubregions(queryParams.subregions as Array<string>);
      setMinNOutputs(queryParams.minNOutputs as number);
      setMaxNOutputs(queryParams.maxNOutputs as number);
      setMinNOutputsOpen(queryParams.minNOutputsOpen as number);
      setMaxNOutputsOpen(queryParams.maxNOutputsOpen as number);
      setMinPOutputsOpen(queryParams.minPOutputsOpen as number);
      setMaxPOutputsOpen(queryParams.maxPOutputsOpen as number);
    },
    [
      setLimit,
      setMaxNOutputs,
      setMaxNOutputsOpen,
      setMaxPOutputsOpen,
      setMinNOutputs,
      setMinNOutputsOpen,
      setMinPOutputsOpen,
      setOrderBy,
      setOrderDir,
      setPage,
      setSubregions,
    ],
  );

  // Form state
  const [entities, setEntities] = React.useState<QueryResult>(initialState);
  const [queryForm, setQueryForm] = React.useState<QueryForm>(defaultQueryForm);
  const [resetFormState, setResetFormState] = React.useState(0);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  // Reset form
  const onResetQueryForm = useCallback(() => {
    setResetFormState((state) => state + 1);
  }, []);

  // Update form values when URL params change
  useEffectAfterRender(() => {
    // When we are not loading update query form to trigger data to be fetched
    if (!isLoading) {
      // TODO: Maybe these should be able to be null or undefined?
      const queryParams: QueryParams = {
        page: page,
        limit: limit,
        orderBy: orderBy,
        orderDir: orderDir,
        subregions: subregions,
        minNOutputs: minNOutputs,
        maxNOutputs: maxNOutputs,
        minNOutputsOpen: minNOutputsOpen,
        maxNOutputsOpen: maxNOutputsOpen,
        minPOutputsOpen: minPOutputsOpen,
        maxPOutputsOpen: maxPOutputsOpen,
      };
      console.log(`Updated state from URL: ${JSON.stringify(queryParams)}`);
      // TODO: when translating from QueryParams to QueryForm, ignore null or undefined values
      // TODO: stats.p_outputs_open
      // TODO: how to handle default values? use withDefault
      setQueryForm(queryParamsToQueryForm(queryParams));
    }
  }, [
    entityType,
    page,
    limit,
    orderBy,
    orderDir,
    subregions,
    minNOutputs,
    maxNOutputs,
    minNOutputsOpen,
    maxNOutputsOpen,
    minPOutputsOpen,
    maxPOutputsOpen,
  ]);

  // Submit search when query params change
  useEffectAfterRender(() => {
    setLoading(true);

    // Update address bar based on form parameters
    // TODO: convert QueryForm to QueryParams, convert default i.e. unset values to null
    // TODO: how do we stop an infinite loop?
    const queryParams = queryFormToQueryParams(queryForm);
    updateURLState(queryParams);

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

  return [entities, queryForm, setQueryForm, isLoading, resetFormState, onResetQueryForm];
};

export type DashboardProps = {
  defaultEntityType: string;
  defaultCountries: QueryResult;
  defaultInstitutions: QueryResult;
  stats: Stats;
};

const Dashboard = ({ defaultEntityType, defaultCountries, defaultInstitutions, stats }: DashboardProps) => {
  // Descriptions
  const descriptions = React.useMemo<Array<any>>(
    () => [
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
    ],
    [stats.end_year, stats.start_year],
  );

  const categoryToTabIndex: Array<string> = React.useMemo<Array<string>>(() => ["country", "institution"], []);
  const defaultTabIndex = categoryToTabIndex.indexOf(defaultEntityType);
  const [tabIndex, setTabIndex] = React.useState<number>(defaultTabIndex);
  const defaultDescription = descriptions[defaultTabIndex];
  const [dashboardText, setDashboardText] = React.useState(defaultDescription);

  // Set tab index and change text based on tab index
  const handleTabsChange = React.useCallback(
    (index: number) => {
      const category = categoryToTabIndex[index];
      setTabIndex(index);
      setDashboardText(descriptions[index]);

      // // If on the /country/ or /institution/ page then update the URL
      // const historyState = window.history.state;
      // if (historyState.as === "/country/" || historyState.as === "/institution/") {
      //   window.history.replaceState(historyState, "", `/${category}/`);
      // }
    },
    [categoryToTabIndex, descriptions],
  );
  //

  //   // const defaultQueryForm = React.useMemo(() => makeDefaultValues(entityStats), [entityStats]);
  //   //

  // Country entity query
  const defaultQueryFormCountry = React.useMemo(() => makeDefaultQueryForm(stats.country), [stats.country]);
  const countryRangeSliderMinMaxValues = React.useMemo(
    () => makeRangeSliderMinMaxValues(stats.country),
    [stats.country],
  );
  const [
    countries,
    queryFormCountry,
    setQueryFormCountry,
    isLoadingCountry,
    resetFormStateCountry,
    onResetQueryFormCountry,
  ] = useEntityQuery("country", defaultCountries, defaultQueryFormCountry);

  // Institution entity query
  const defaultQueryFormInstitution = React.useMemo(() => makeDefaultQueryForm(stats.institution), [stats.institution]);
  const institutionRangeSliderMinMaxValues = React.useMemo(
    () => makeRangeSliderMinMaxValues(stats.institution),
    [stats.institution],
  );
  const [
    institutions,
    queryFormInstitution,
    setQueryFormInstitution,
    isLoadingInstitution,
    resetFormStateInstitution,
    onResetQueryFormInstitution,
  ] = useEntityQuery("institution", defaultInstitutions, defaultQueryFormInstitution);

  // const rangeSliderMinMaxValues = React.useMemo(() => makeDefaultOpenAccessValues(entityStats), [entityStats]);

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
  }, [isMd, onCloseFilterCountry, onCloseFilterInstitution]);

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
  const countries = await client.getEntities("country", {});
  const institutions = await client.getEntities("institution", {});
  return {
    props: {
      defaultCountries: countries,
      defaultInstitutions: institutions,
      stats: stats,
    },
  };
}

export default Dashboard;

// const institutionQuery = queryFormToQueryParams(makeDefaultValues(stats.institution));
// const countryQuery = queryFormToQueryParams(makeDefaultValues(stats.country));

// // QueryForm to QueryParams
// const removeDefaultValues = {
//   ...DEFAULT_PAGE_VALUES,
//   subregions: [],
//   institutionTypes: [],
//   ...makeDefaultOpenAccessValues(entityStats),
// };
// removeDefaultValues.orderBy = "p_outputs_open";

// // Update URL
// const urlParams = makeFilterParams(entityType, queryParams);
// let url = entityType;
// if (urlParams.size) {
//   url += `?${urlParams.toString()}`;
// }
// console.log(`New query params: ${url}`);
// router.push(url, undefined, { shallow: true }).then();

// const DEFAULT_PAGE_VALUES = {
//   page: 0,
//   limit: 18, // TODO: make sure this value is used in workers-api
//   orderBy: "stats.p_outputs_open",
//   orderDir: "dsc",
// };
