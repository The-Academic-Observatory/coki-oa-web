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
import SliderForm, { sliderValues, sliderMinMax } from "./SliderForm";
import { makeFilterUrl } from "../lib/api";
import { useDebounce } from "../lib/utils";
//TODO
//import CountryForm, { CustomItem } from "./CountryForm";

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
  //TODO
  // country: string[];
}

interface TableFilterProps {
  endpoint: string;
  setFilterParams: React.Dispatch<React.SetStateAction<string>>;
  setPageParams: React.Dispatch<React.SetStateAction<string>>;
  defaultMinMax: sliderMinMax;
  minMax: sliderMinMax;
  setMinMax: React.Dispatch<React.SetStateAction<sliderMinMax>>;
}
const TableFilter = ({
  endpoint,
  setFilterParams,
  setPageParams,
  defaultMinMax,
  minMax,
  setMinMax,
}: TableFilterProps) => {
  // Set default selected subregions
  const defaultSubregions = {} as Record<typeof subregions[number], boolean>;
  subregions.forEach((subregion) => {
    defaultSubregions[subregion] = true;
  });
  const [checkedSubregions, setCheckedSubregions] = React.useState(defaultSubregions);

  // Set parameters used to get slider min and max values
  const [minMaxParams, setMinMaxParams] = React.useState("");
  const debouncedMinMaxParams = useDebounce(minMaxParams, 300);

  // Update min and max values for sliders when other search parameters have changed
  React.useEffect(() => {
    const url = makeFilterUrl(endpoint + "?" + debouncedMinMaxParams);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const minMax = { min: data.min, max: data.max };
        minMax["min"]["p_outputs_open"] = Math.ceil(minMax["min"]["p_outputs_open"]);
        minMax["max"]["p_outputs_open"] = Math.ceil(minMax["max"]["p_outputs_open"]);
        setMinMax(minMax);
      });
  }, [debouncedMinMaxParams]);

  // Set slider values
  const [sliderValues, setSliderValues] = React.useState<sliderValues>({
    n_outputs: [defaultMinMax.min.n_outputs, defaultMinMax.max.n_outputs],
    n_outputs_open: [defaultMinMax.min.n_outputs_open, defaultMinMax.max.n_outputs_open],
    p_outputs_open: [defaultMinMax.min.p_outputs_open, defaultMinMax.max.p_outputs_open],
  });

  // Update the current slider values when min and max have changed
  React.useEffect(() => {
    if (minMax !== defaultMinMax) {
      setSliderValues({
        n_outputs: [minMax.min.n_outputs, minMax.max.n_outputs],
        n_outputs_open: [minMax.min.n_outputs_open, minMax.max.n_outputs_open],
        p_outputs_open: [minMax.min.p_outputs_open, minMax.max.p_outputs_open],
      });
      setValue("n_outputs", [minMax.min.n_outputs, minMax.max.n_outputs]);
      setValue("n_outputs_open", [minMax.min.n_outputs_open, minMax.max.n_outputs_open]);
      setValue("p_outputs_open", [minMax.min.p_outputs_open, minMax.max.p_outputs_open]);
      onSubmit();
    }
  }, [minMax]);

  // TODO Selected countries
  // const [selectedCountries, setSelectedCountries] = React.useState<CustomItem[]>([]);

  const { handleSubmit, control, setValue, reset } = useForm<IFormInputs>();
  const onSubmit = handleSubmit((data: IFormInputs) => {
    //TODO country values
    // const countryValues = data.country === undefined ? "" : data.country.toString();
    const institutionTypeValues = transformFormResults(data.institutionType);
    const subregionValues = transformFormResults(data.subregion);
    const totalOutputs = data.n_outputs;
    const totalOutputsOpen = data.n_outputs_open;
    const percentOutputsOpen = data.p_outputs_open;
    const filterParams = [];
    const minMaxParams = [];
    // TODO add country values to search params
    // if (countryValues) {
    //   searchParams.push(`countries=${countryValues}`);
    // }
    if (data.subregion != undefined) {
      filterParams.push(`subregions=${subregionValues}`);
      minMaxParams.push(`subregions=${subregionValues}`);
    }
    if (data.institutionType != undefined) {
      filterParams.push(`institutionTypes=${institutionTypeValues}`);
      minMaxParams.push(`institutionTypes=${institutionTypeValues}`);
    }
    if (totalOutputs) {
      filterParams.push(`minNOutputs=${totalOutputs[0]}&maxNOutputs=${totalOutputs[1] + 1}`);
    }
    if (totalOutputsOpen) {
      filterParams.push(`minNOutputsOpen=${totalOutputsOpen[0]}&maxNOutputsOpen=${totalOutputsOpen[1] + 1}`);
    }
    if (percentOutputsOpen) {
      filterParams.push(`minPOutputsOpen=${percentOutputsOpen[0]}&maxPOutputsOpen=${percentOutputsOpen[1]}`);
    }
    setFilterParams(filterParams.join("&"));
    setPageParams("page=0");
    setMinMaxParams(minMaxParams.join("&"));
  });

  const onReset = () => {
    setFilterParams("");
    setMinMaxParams("");
    setSliderValues({
      n_outputs: [minMax.min.n_outputs, minMax.max.n_outputs],
      n_outputs_open: [minMax.min.n_outputs_open, minMax.max.n_outputs_open],
      p_outputs_open: [minMax.min.p_outputs_open, minMax.max.p_outputs_open],
    });
    setCheckedSubregions(defaultSubregions);
    //TODO reset countries
    // setSelectedCountries([]);
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
            form={SliderForm(control, sliderValues, setSliderValues, minMax, onSubmit)}
          />
          {endpoint === "institutions" ? (
            <>
              <FilterAccordionItem name={"Institution Type"} form={InstitutionTypeForm(control, onSubmit)} />
              {/*TODO include country accordion item*/}
              {/*<FilterAccordionItem*/}
              {/*  name={"Country"}*/}
              {/*  form={CountryForm(control, selectedCountries, setSelectedCountries)}*/}
              {/*/>*/}
            </>
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
