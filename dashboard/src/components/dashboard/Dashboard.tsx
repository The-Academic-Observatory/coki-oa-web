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
import { FilterForm, institutionTypes, OpenAccess, QueryForm, REGIONS } from "@/components/filter";
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
import { diff, applyChange } from "deep-diff";
import cloneDeep from "lodash/cloneDeep";
import lodashSet from "lodash.set";

const MAX_TABS_WIDTH = "1100px";

function extractDifferences(lhs: any, rhs: any) {
  const differences = diff(lhs, rhs);
  if (!differences) return {};

  const result: any = {};
  for (const change of differences) {
    if (change.kind === "N" || change.kind === "E") {
      applyChange(result, rhs, change);
    }
  }
  return result;
}

const setValueIfNotNull = (obj: any, path: string, value: any) => {
  if (value !== null && value !== undefined) {
    lodashSet(obj, path, value);
  }
};

const queryParamsToQueryForm = (defaultValues: QueryForm, queryParams: QueryParams): QueryForm => {
  const form: QueryForm = cloneDeep(defaultValues);

  setValueIfNotNull(form, "page.page", queryParams.page);
  setValueIfNotNull(form, "page.limit", queryParams.limit);
  setValueIfNotNull(form, "page.orderBy", queryParams.orderBy);
  setValueIfNotNull(form, "page.orderDir", queryParams.orderDir);
  setValueIfNotNull(form, "openAccess.minNOutputs", queryParams.minNOutputs);
  setValueIfNotNull(form, "openAccess.maxNOutputs", queryParams.maxNOutputs);
  setValueIfNotNull(form, "openAccess.minNOutputsOpen", queryParams.minNOutputsOpen);
  setValueIfNotNull(form, "openAccess.maxNOutputsOpen", queryParams.maxNOutputsOpen);
  setValueIfNotNull(form, "openAccess.minPOutputsOpen", queryParams.minPOutputsOpen);
  setValueIfNotNull(form, "openAccess.maxPOutputsOpen", queryParams.maxPOutputsOpen);

  // Add any true subregions
  if (queryParams.subregions != null) {
    for (const subregion of queryParams.subregions) {
      form.subregion[subregion] = true;
    }
  }

  // Add institutionTypes
  if (queryParams.institutionTypes != null) {
    for (const institutionType of queryParams.institutionTypes) {
      form.institutionType[institutionType] = true;
    }
  }

  return form;
};

export const queryFormToQueryParams = (queryForm: QueryForm): QueryParams => {
  const q: QueryParams = {
    page: null,
    limit: null,
    orderBy: null,
    orderDir: null,
    minNOutputs: null,
    maxNOutputs: null,
    minNOutputsOpen: null,
    maxNOutputsOpen: null,
    minPOutputsOpen: null,
    maxPOutputsOpen: null,
    subregions: null,
    institutionTypes: null,
  };

  setValueIfNotNull(q, "page", queryForm?.page?.page);
  setValueIfNotNull(q, "limit", queryForm?.page?.limit);
  setValueIfNotNull(q, "orderBy", queryForm?.page?.orderBy);
  setValueIfNotNull(q, "orderDir", queryForm?.page?.orderDir);
  setValueIfNotNull(q, "minNOutputs", queryForm?.openAccess?.minNOutputs);
  setValueIfNotNull(q, "maxNOutputs", queryForm?.openAccess?.maxNOutputs);
  setValueIfNotNull(q, "minNOutputsOpen", queryForm?.openAccess?.minNOutputsOpen);
  setValueIfNotNull(q, "maxNOutputsOpen", queryForm?.openAccess?.maxNOutputsOpen);
  setValueIfNotNull(q, "minPOutputsOpen", queryForm?.openAccess?.minPOutputsOpen);
  setValueIfNotNull(q, "maxPOutputsOpen", queryForm?.openAccess?.maxPOutputsOpen);

  // Set subregions keys that are true
  if (queryForm.subregion != null) {
    const subregions = Object.keys(queryForm.subregion).filter((key) => {
      return queryForm.subregion[key];
    });
    if (subregions.length) {
      setValueIfNotNull(q, "subregions", subregions);
    }
  }

  // Set institution types
  if (queryForm.institutionType != null) {
    const institutionTypes = Object.keys(queryForm.institutionType).filter((key) => {
      return queryForm.institutionType[key];
    });
    if (institutionTypes.length) {
      setValueIfNotNull(q, "institutionTypes", institutionTypes);
    }
  }

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
  Object.keys(REGIONS).map((region) => {
    defaults.region[region] = false;
    for (let subregion of REGIONS[region]) {
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
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [limit, setLimit] = useQueryState("limit", parseAsInteger);
  const [orderBy, setOrderBy] = useQueryState("orderBy", parseAsString);
  const [orderDir, setOrderDir] = useQueryState("orderDir", parseAsString);
  const [minNOutputs, setMinNOutputs] = useQueryState("minNOutputs", parseAsInteger);
  const [maxNOutputs, setMaxNOutputs] = useQueryState("maxNOutputs", parseAsInteger);
  const [minNOutputsOpen, setMinNOutputsOpen] = useQueryState("minNOutputsOpen", parseAsInteger);
  const [maxNOutputsOpen, setMaxNOutputsOpen] = useQueryState("maxNOutputsOpen", parseAsInteger);
  const [minPOutputsOpen, setMinPOutputsOpen] = useQueryState("minPOutputsOpen", parseAsFloat);
  const [maxPOutputsOpen, setMaxPOutputsOpen] = useQueryState("maxPOutputsOpen", parseAsFloat);
  const [subregions, setSubregions] = useQueryState("subregions", parseAsArrayOf(parseAsString, ","));
  const [institutionTypes, setInstitutionTypes] = useQueryState("institutionTypes", parseAsArrayOf(parseAsString, ","));

  const updateURLState = React.useCallback(
    (queryParams: QueryParams) => {
      setPage(queryParams.page);
      setLimit(queryParams.limit);
      setOrderBy(queryParams.orderBy);
      setOrderDir(queryParams.orderDir);
      setSubregions(queryParams.subregions);
      setMinNOutputs(queryParams.minNOutputs);
      setMaxNOutputs(queryParams.maxNOutputs);
      setMinNOutputsOpen(queryParams.minNOutputsOpen);
      setMaxNOutputsOpen(queryParams.maxNOutputsOpen);
      setMinPOutputsOpen(queryParams.minPOutputsOpen);
      setMaxPOutputsOpen(queryParams.maxPOutputsOpen);
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
  useEffect(() => {
    // When we are not loading update query form to trigger data to be fetched
    if (!isLoading) {
      console.log(`Received query params: ${new Date().toLocaleString("en-NZ")}`);

      const queryParams: QueryParams = {
        page: page,
        limit: limit,
        orderBy: orderBy,
        orderDir: orderDir,
        minNOutputs: minNOutputs,
        maxNOutputs: maxNOutputs,
        minNOutputsOpen: minNOutputsOpen,
        maxNOutputsOpen: maxNOutputsOpen,
        minPOutputsOpen: minPOutputsOpen,
        maxPOutputsOpen: maxPOutputsOpen,
        subregions: subregions,
        institutionTypes: institutionTypes,
      };
      const queryForm = queryParamsToQueryForm(defaultQueryForm, queryParams);
      setQueryForm(queryForm);
    }
  }, [
    entityType,
    page,
    limit,
    orderBy,
    orderDir,
    minNOutputs,
    maxNOutputs,
    minNOutputsOpen,
    maxNOutputsOpen,
    minPOutputsOpen,
    maxPOutputsOpen,
    subregions,
    institutionTypes,
  ]);

  // Submit search when form values change
  useEffectAfterRender(() => {
    setLoading(true);

    // We only want the query parameters that the user has changed to be reflected in the address bar. To achieve this
    // we calculate what query params have changed from defaultQueryForm, then convert these into a QueryParams object.
    // Any values not changed are set as null, which is what next-usequerystate needs in order for them to not show
    // up in the address bar. Null values also mean that if the value was set by the user and then changed back to
    // the default it will be removed from the URL query params.
    const queryDiff = extractDifferences(defaultQueryForm, queryForm);
    const queryParams = queryFormToQueryParams(queryDiff);
    const dt = new Date();
    console.log(`Submit query params: ${dt.toLocaleString("en-NZ")}`);

    // Update URL state with next-usequerystate
    // TODO: if queryParams match next-usequerystate values, then don't call updateURLState?
    updateURLState(queryParams);

    // Fetch data from server
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
  const categoryToTabIndex: Array<string> = React.useMemo<Array<string>>(() => ["country", "institution"], []);
  const defaultTabIndex = categoryToTabIndex.indexOf(defaultEntityType);
  const [tabIndex, setTabIndex] = React.useState<number>(defaultTabIndex);
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

  // Modal filters
  // TODO: useDisclosure causing index page to render twice: https://github.com/chakra-ui/chakra-ui/issues/5517
  const { isOpen: isOpenFilterCountry, onOpen: onOpenFilterCountry, onClose: onCloseFilterCountry } = useDisclosure();
  const {
    isOpen: isOpenFilterInstitution,
    onOpen: onOpenFilterInstitution,
    onClose: onCloseFilterInstitution,
  } = useDisclosure();

  return (
    <Box m={{ base: 0, md: "25px 25px 90px", std: "25px 40px 90px" }}>
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
        </Box>

        <Tabs gridArea="table" isFitted variant="dashboard" bg="white" index={tabIndex} overflow="hidden">
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
            <TabPanel p={0}></TabPanel>
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
      </Grid>
    </Box>
  );
};

export async function getDashboardStaticProps() {
  // Fetch data via the API rather than locally to make sure that it is ordered in the same way as filtering API
  const client = new OADataAPI();
  const stats = client.getStats();
  const countries = await client.getEntities("country", {});
  return {
    props: {
      defaultCountries: countries,
      defaultInstitutions: {},
      stats: stats,
    },
  };
}

export default Dashboard;
