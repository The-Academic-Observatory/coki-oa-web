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
// Author: Aniek Roelofs

import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControlProps,
  HStack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import Icon from "./Icon";
import InstitutionTypeForm, { institutionTypes } from "./InstitutionTypeForm";
import RegionForm from "./RegionForm";
import SubregionForm, { subregions } from "./SubregionForm";
import StatsForm, { sliderValues } from "./StatsForm";
import { makeFilterUrl } from "../lib/api";

export const transformFormResults = (formResults: { [x: string]: boolean }) => {
  if (formResults === undefined) {
    return "";
  }
  return Object.keys(formResults)
    .reduce((result: string[], item) => {
      if (formResults[item]) {
        result.push(encodeURIComponent(item));
      }
      return result;
    }, [])
    .toString();
};

interface FilterAccordionItemProps {
  name: string;
  form: FormControlProps;
}
const FilterAccordionItem = ({ name, form }: FilterAccordionItemProps) => {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" textStyle="tableHeader">
                {name}
              </Box>
              {isExpanded ? <CloseIcon fontSize="12px" /> : <AddIcon fontSize="12px" />}
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} bg="#F9FAFA" borderTopWidth={"1px"}>
            {isExpanded ? form : ""}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

export interface IFormInputs {
  subregion: Record<typeof subregions[number], boolean>;
  institutionType: Record<typeof institutionTypes[number], boolean>;
  n_outputs: number[];
  n_outputs_open: number[];
  p_outputs_open: number[];
}

interface TableFilterProps {
  tabIndex: number;
  setFilterParams: (e: string) => void;
  setPageParams: (e: string) => void;
}
const TableFilter = ({ tabIndex, setFilterParams, setPageParams }: TableFilterProps) => {
  // Store the search parameters to find the min and max values using the API
  const [minMaxParamsCountry, setMinMaxParamsCountry] = React.useState("");
  const [minMaxParamsInstitution, setMinMaxParamsInstitution] = React.useState("");

  // Fetch + set the min and max values using the API
  const fetchMinMax = (
    endpoint: string,
    setMinMax: (e: {
      min: { n_outputs: number; n_outputs_open: number; p_outputs_open: number };
      max: { n_outputs: number; n_outputs_open: number; p_outputs_open: number };
    }) => void,
  ) => {
    const url = makeFilterUrl(endpoint);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const minMax = { min: data.min, max: data.max };
        minMax["min"]["p_outputs_open"] = Math.ceil(minMax["min"]["p_outputs_open"]);
        minMax["max"]["p_outputs_open"] = Math.ceil(minMax["max"]["p_outputs_open"]);
        setMinMax(minMax);
      });
  };

  // Min and Max for the slider filters, country tab
  const [minMaxCountry, setMinMaxCountry] = React.useState({
    min: {
      n_outputs: 0,
      n_outputs_open: 0,
      p_outputs_open: 0,
    },
    max: {
      n_outputs: 12000000,
      n_outputs_open: 5000000,
      p_outputs_open: 100,
    },
  });
  // Min and Max for the slider filters, institution tab
  const [minMaxInstitution, setMinMaxInstitution] = React.useState({
    min: {
      n_outputs: 0,
      n_outputs_open: 0,
      p_outputs_open: 0,
    },
    max: {
      n_outputs: 1000000,
      n_outputs_open: 500000,
      p_outputs_open: 100,
    },
  });
  const minMax = tabIndex === 0 ? minMaxCountry : minMaxInstitution;

  // Set initial min and max values for the sliders after fetching data from API
  React.useEffect(() => {
    fetchMinMax("countries?" + minMaxParamsCountry, setMinMaxCountry);
    fetchMinMax("institutions?" + minMaxParamsInstitution, setMinMaxInstitution);
  }, []);
  // Update min and max values for sliders when other search parameters have changed
  React.useEffect(() => {
    fetchMinMax("countries?" + minMaxParamsCountry, setMinMaxCountry);
  }, [minMaxParamsCountry]);
  React.useEffect(() => {
    fetchMinMax("institutions?" + minMaxParamsInstitution, setMinMaxInstitution);
  }, [minMaxParamsInstitution]);
  // Update the current slider values when min and max have changed
  React.useEffect(() => {
    setSliderValuesCountry({
      n_outputs: [minMaxCountry.min.n_outputs, minMaxCountry.max.n_outputs],
      n_outputs_open: [minMaxCountry.min.n_outputs_open, minMaxCountry.max.n_outputs_open],
      p_outputs_open: [minMaxCountry.min.p_outputs_open, minMaxCountry.max.p_outputs_open],
    });
    setValue("n_outputs", [minMaxCountry.min.n_outputs, minMaxCountry.max.n_outputs]);
    setValue("n_outputs_open", [minMaxCountry.min.n_outputs_open, minMaxCountry.max.n_outputs_open]);
    setValue("p_outputs_open", [minMaxCountry.min.p_outputs_open, minMaxCountry.max.p_outputs_open]);
    onSubmit();
  }, [minMaxCountry]);
  React.useEffect(() => {
    setSliderValuesInstitution({
      n_outputs: [minMaxInstitution.min.n_outputs, minMaxInstitution.max.n_outputs],
      n_outputs_open: [minMaxInstitution.min.n_outputs_open, minMaxInstitution.max.n_outputs_open],
      p_outputs_open: [minMaxInstitution.min.p_outputs_open, minMaxInstitution.max.p_outputs_open],
    });
    setValue("n_outputs", [minMaxInstitution.min.n_outputs, minMaxInstitution.max.n_outputs]);
    setValue("n_outputs_open", [minMaxInstitution.min.n_outputs_open, minMaxInstitution.max.n_outputs_open]);
    setValue("p_outputs_open", [minMaxInstitution.min.p_outputs_open, minMaxInstitution.max.p_outputs_open]);
    onSubmit();
  }, [minMaxInstitution]);

  // Set the default slider values
  const [sliderValuesCountry, setSliderValuesCountry] = React.useState<sliderValues>({
    n_outputs: [0, 12000000],
    n_outputs_open: [0, 5000000],
    p_outputs_open: [0, 100],
  });
  const [sliderValuesInstitution, setSliderValuesInstitution] = React.useState<sliderValues>({
    n_outputs: [0, 1000000],
    n_outputs_open: [0, 500000],
    p_outputs_open: [0, 100],
  });
  const sliderValues = tabIndex === 0 ? sliderValuesCountry : sliderValuesInstitution;
  const setSliderValues = tabIndex === 0 ? setSliderValuesCountry : setSliderValuesInstitution;

  // Set default selected subregions
  const defaultSubregions = {} as Record<typeof subregions[number], boolean>;
  subregions.forEach((subregion) => {
    defaultSubregions[subregion] = true;
  });
  const [checkedSubregionsCountry, setCheckedSubregionsCountry] = React.useState(defaultSubregions);
  const [checkedSubregionsInstitution, setCheckedSubregionsInstitution] = React.useState(defaultSubregions);
  const checkedSubregions = tabIndex === 0 ? checkedSubregionsCountry : checkedSubregionsInstitution;
  const setCheckedSubregions = tabIndex === 0 ? setCheckedSubregionsCountry : setCheckedSubregionsInstitution;

  const { handleSubmit, control, setValue, reset } = useForm<IFormInputs>();
  const onSubmit = handleSubmit((data: IFormInputs) => {
    const institutionTypeValues = transformFormResults(data.institutionType);
    const subregionValues = transformFormResults(data.subregion);
    const totalOutputs = data.n_outputs;
    const totalOutputsOpen = data.n_outputs_open;
    const percentOutputsOpen = data.p_outputs_open;
    const searchParams = [];
    const statsSearchParams = [];
    if (data.subregion != undefined) {
      searchParams.push(`subregions=${subregionValues}`);
      statsSearchParams.push(`subregions=${subregionValues}`);
    }
    if (data.institutionType != undefined) {
      searchParams.push(`institutionTypes=${institutionTypeValues}`);
      statsSearchParams.push(`institutionTypes=${institutionTypeValues}`);
    }
    if (totalOutputs) {
      searchParams.push(`minNOutputs=${totalOutputs[0]}&maxNOutputs=${totalOutputs[1] + 1}`);
    }
    if (totalOutputsOpen) {
      searchParams.push(`minNOutputsOpen=${totalOutputsOpen[0]}&maxNOutputsOpen=${totalOutputsOpen[1] + 1}`);
    }
    if (percentOutputsOpen) {
      searchParams.push(`minPOutputsOpen=${percentOutputsOpen[0]}&maxPOutputsOpen=${percentOutputsOpen[1]}`);
    }
    setFilterParams(searchParams.join("&"));
    setPageParams("page=0");
    if (tabIndex === 0) {
      setMinMaxParamsCountry(statsSearchParams.join("&"));
    } else {
      setMinMaxParamsInstitution(statsSearchParams.join("&"));
    }
  });

  const onReset = () => {
    setFilterParams("");
    if (tabIndex === 0) {
      setMinMaxParamsCountry("");
    } else {
      setMinMaxParamsInstitution("");
    }
    setSliderValues({
      n_outputs: [minMax.min.n_outputs, minMax.max.n_outputs],
      n_outputs_open: [minMax.min.n_outputs_open, minMax.max.n_outputs_open],
      p_outputs_open: [minMax.min.p_outputs_open, minMax.max.p_outputs_open],
    });
    setCheckedSubregions(defaultSubregions);
    reset();
  };

  return (
    <form onSubmit={onSubmit} onReset={onReset}>
      <Box borderRadius="md" boxShadow={{ base: "none", md: "md" }} overflow={"hidden"}>
        <HStack bg="brand.500" justifyContent="center" spacing="10px" height="60px">
          <Box>
            <Icon icon="filter" color="white" size={24} />
          </Box>
          <Text fontWeight="900" fontSize="12px" textTransform="uppercase" color="white">
            Filters
          </Text>
        </HStack>

        <Accordion allowMultiple variant="tableFilter">
          <FilterAccordionItem
            name={"Region"}
            form={RegionForm(checkedSubregions, setCheckedSubregions, setValue, onSubmit)}
          />
          <FilterAccordionItem
            name={"Subregion"}
            form={SubregionForm(control, checkedSubregions, setCheckedSubregions, setValue, onSubmit)}
          />
          <FilterAccordionItem
            name={"Publication Count / Open Access"}
            form={StatsForm(control, sliderValues, setSliderValues, minMax, onSubmit)}
          />
          {tabIndex === 1 ? (
            <FilterAccordionItem name={"Institution Type"} form={InstitutionTypeForm(control, onSubmit)} />
          ) : (
            ""
          )}
        </Accordion>

        <HStack justifyContent="space-around" m={{ base: "none", md: "10px 0px" }}>
          <Button variant="tableFilter" type="reset">
            <Text>Reset Filters</Text>
          </Button>
        </HStack>
      </Box>
    </form>
  );
};

export default TableFilter;
