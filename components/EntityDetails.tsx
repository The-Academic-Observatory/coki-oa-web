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

import React, { ReactElement, ReactNode, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Flex,
  FlexProps,
  Grid,
  GridItem,
  HStack,
  Image,
  LinkProps,
  StackProps,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Entity } from "../lib/model";
import DonutSparkline from "./DonutSparkline";
import styles from "./EntityDetails.module.css";
import Card from "./Card";
import Icon from "./Icon";
import Link from "./Link";
import BreakdownSparkline from "./BreakdownSparkline";
import { toReadableNumber } from "../lib/utils";
import { Pie } from "@nivo/pie";
import { linearGradientDef } from "@nivo/core";
import { Stream } from "@nivo/stream";
import { Bar } from "@nivo/bar";
import { AxisLegendPosition } from "@nivo/axes";
import Head from "next/head";
import Breadcrumbs from "./Breadcrumbs";
import TextCollapse from "./TextCollapse";

interface CardProps extends BoxProps {
  children: ReactNode;
}

const makeDescription = (entity: Entity) => {
  let area = "";
  if (entity.category === "institution") {
    area = `${entity.country},`;
  }

  return (
    `Open Access statistics for ${entity.name}, ${area} covering research outputs published from ` +
    `${entity.start_year} to ${entity.end_year}.`
  );
};

const EntityCard = ({ children, ...rest }: CardProps) => {
  return (
    <Box bg={"white"} border={"1px solid #EBEBEB"} p={{ base: "14px", sm: "24px" }} {...rest}>
      {children}
    </Box>
  );
};

interface EntityDetailsProps {
  entity: Entity;
  lastUpdated: string;
}

const EntityDetails = ({ entity, lastUpdated, ...rest }: EntityDetailsProps) => {
  const metaDescription = `How well does ${entity.name} perform at Open Access publishing? ` + makeDescription(entity);

  return (
    <Box layerStyle="page">
      <Head>
        <title>COKI: {entity.name}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <Breadcrumbs
        breadcrumbs={[
          { title: entity.category, href: `/${entity.category}/` },
          {
            title: entity.name,
            href: `/${entity.category}/${entity.id}/`,
          },
        ]}
      />

      <Card bgBase="none" maxWidth="100vw">
        <VStack spacing={{ base: "8px", md: "24px" }}>
          <EntitySummary entity={entity} />
          <EntityBreakdown entity={entity} />
          <EntityOATimeseries entity={entity} />
          <EntityOAVolume entity={entity} />
          <EntityPublisherOpen entity={entity} />
          <EntityFooter lastUpdated={lastUpdated} />
        </VStack>
      </Card>
    </Box>
  );
};

interface EntityFooterProps extends BoxProps {
  lastUpdated: string;
}

const EntityFooter = ({ lastUpdated }: EntityFooterProps) => {
  return (
    <Flex
      w="full"
      alignItems="center"
      flexDirection={{ base: "column", sm: "row" }}
      justifyContent="space-between"
      py="12px"
    >
      <Link href="/" textDecorationColor="white !important">
        <Button variant="dashboard" fontSize="14px" lineHeight="14px">
          <Text>Return to Dashboard</Text>
        </Button>
      </Link>
      <Text textStyle="lastUpdated" pt={{ base: "16px", sm: 0 }}>
        Data updated {lastUpdated}
      </Text>
    </Flex>
  );
};

interface EntityBreakdownProps extends BoxProps {
  entity: Entity;
}

const EntityBreakdown = ({ entity, ...rest }: EntityBreakdownProps) => {
  const stats = entity.stats;
  const values = [
    stats.p_outputs_publisher_open_only,
    stats.p_outputs_both,
    stats.p_outputs_other_platform_open_only,
    stats.p_outputs_closed,
  ];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];
  const labels = ["Publisher Open", "Both", "Other Platform Open", "Closed"];

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Breakdown</Text>
      <BreakdownSparkline values={values} colors={colors} width={"100%"} height={48} py={3} labels={labels} />
    </EntityCard>
  );
};

interface EntityOATimeseriesProps extends BoxProps {
  entity: Entity;
}

const EntityOATimeseries = ({ entity, ...rest }: EntityOATimeseriesProps) => {
  // Fill time series data with zeros
  let data = [];
  for (let year = entity.start_year; year <= entity.end_year; year++) {
    data.push({
      "Publisher Open": 0,
      Both: 0,
      "Other Platform Open": 0,
      Closed: 0,
    });
  }

  // Merge real data with zeroed data
  entity.years.forEach((t) => {
    const year = t.year;
    const stats = t.stats;
    const i = year - entity.start_year;

    data[i] = {
      "Publisher Open": stats.p_outputs_publisher_open_only,
      Both: stats.p_outputs_both,
      "Other Platform Open": stats.p_outputs_other_platform_open_only,
      Closed: stats.p_outputs_closed,
    };
  });

  const labels = ["Publisher Open", "Both", "Other Platform Open", "Closed"];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Percentage of Open Access over time</Text>
      <Box>
        <OAPercentageChart data={data} startYear={entity.start_year} />
        <Legend labels={labels} colors={colors} />
      </Box>
    </EntityCard>
  );
};

interface EntityOAVolumeProps extends BoxProps {
  entity: Entity;
}

const EntityOAVolume = ({ entity, ...rest }: EntityOAVolumeProps) => {
  // Fill time series data with zeros
  let data = [];
  for (let year = entity.start_year; year <= entity.end_year; year++) {
    data.push({
      year: year,
      Open: 0,
      Closed: 0,
    });
  }

  // Merge real data with zeroed data
  let maxOutputs = 0;
  entity.years.forEach((t) => {
    const year = t.year;
    const stats = t.stats;
    const i = year - entity.start_year;

    if (stats.n_outputs > maxOutputs) {
      maxOutputs = stats.n_outputs;
    }

    data[i] = {
      year: year,
      Open: stats.n_outputs_open,
      Closed: stats.n_outputs_closed,
    };
  });

  let labels = ["Open", "Closed"];
  let colors = ["#FF671C", "#EBEBEB"];

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Volume of Open Access over time</Text>
      <Box>
        <OAVolumeChart data={data} startYear={entity.start_year} />
        <Legend labels={labels} colors={colors} />
      </Box>
    </EntityCard>
  );
};

interface EntityPublisherOpenProps extends BoxProps {
  entity: Entity;
}

const EntityPublisherOpen = ({ entity, ...rest }: EntityPublisherOpenProps) => {
  const stats = entity.stats;
  const data = [
    {
      id: "OA Journal",
      label: "OA Journal",
      value: stats.p_outputs_oa_journal,
      color: "#d5bd40",
    },
    {
      id: "Hybrid",
      label: "Hybrid",
      value: stats.p_outputs_hybrid,
      color: "#ffd700",
    },
    {
      id: "No Guarantees",
      label: "No Guarantees",
      value: stats.p_outputs_no_guarantees,
      color: "#f8eb8f",
    },
  ];
  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">Publisher Open</Text>
      <Flex w={"full"} flexDirection={{ base: "column", md: "row" }} alignItems="center" justifyContent="center">
        <PublisherOpenDonut data={data} />
        <Grid layerStyle="chartKeys">
          <GridItem borderTop="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundImage="linear-gradient(-135deg, #fdd500, #b9a436)" />
              <Text textStyle="chartKeyHeader">OA Journal</Text>
              <Text textStyle="chartKeyDescription" display={{ base: "none", sm: "block" }}>
                &nbsp;- published in open access journal
              </Text>
            </Flex>
          </GridItem>
          <GridItem borderTop="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundColor="#ffd700" />
              <Text textStyle="chartKeyHeader">Hybrid</Text>
              <Text textStyle="chartKeyDescription" display={{ base: "none", sm: "block" }}>
                &nbsp;- subscription publisher, open license
              </Text>
            </Flex>
          </GridItem>
          <GridItem borderTop="2px solid #EBEBEB" borderBottom="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundColor="#f8eb8f" />
              <Text textStyle="chartKeyHeader">No Guarantees</Text>
              <Text textStyle="chartKeyDescription" display={{ base: "none", sm: "block" }}>
                &nbsp;- subscription publisher, no reuse rights
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </EntityCard>
  );
};

interface EntitySummaryProps extends FlexProps {
  entity: Entity;
}

const EntitySummary = ({ entity, ...rest }: EntitySummaryProps) => {
  return (
    <Flex width={"full"} {...rest}>
      <Flex flex={1} flexDirection={"column"} pr={{ base: 0, md: "24px" }}>
        <EntityHeading flexGrow={1} entity={entity} />
        <EntityStats entity={entity} />
      </Flex>
      <EntityMetadata entity={entity} width={"220px"} display={{ base: "none", md: "block" }} isMobile={false} />
    </Flex>
  );
};

interface EntityHeadingProps extends StackProps {
  entity: Entity;
}

const EntityHeading = ({ entity, ...rest }: EntityHeadingProps) => {
  const previewText = makeDescription(entity);
  let description = <> {makeDescription(entity)} </>;
  if (entity.description.text !== "") {
    description = (
      <>
        {entity.description.text}{" "}
        <Box as="span" fontSize="14px" lineHeight="14px">
          Derived from{" "}
          <a href={entity.description.url} target="_blank" rel="noreferrer">
            Wikipedia
          </a>{" "}
          licensed {"  "}
          <a href={entity.description.license} target="_blank" rel="noreferrer">
            CC-BY-SA
          </a>
          .
        </Box>
      </>
    );
  }
  return (
    <VStack alignItems={"left"} pb={{ base: "16px", md: 0 }} {...rest}>
      <HStack pb={{ base: "12px", md: "12px" }}>
        <Box
          minWidth={{ base: "60px", md: "100px" }}
          width={{ base: "60px", md: "100px" }}
          height={{ base: "60px", md: "100px" }}
          mr={{ base: "10px", md: "24px" }}
        >
          <Image
            rounded="full"
            objectFit="cover"
            boxSize={{ base: "60px", md: "100px" }}
            src={entity.logo_l}
            alt={entity.name}
            style={{
              filter: "drop-shadow( 0px 0px 10px rgba(0, 0, 0, .2))",
            }}
          />
        </Box>

        <VStack alignItems="left">
          <Text as="h1" textStyle="entityHeading">
            {entity.name}
          </Text>
          <Text textStyle="p" fontSize="24px" lineHeight="28px" display={{ base: "none", md: "block" }}>
            {description}
          </Text>
        </VStack>
      </HStack>
      <TextCollapse
        display={{ base: "block", sm: "block", md: "none" }}
        previewText={previewText}
        text={description}
        showCollapse={entity.description.text !== ""}
      />
    </VStack>
  );
};

interface MetadataLinkProps extends LinkProps {
  icon: string;
  name: string;
  href: string;
}

const MetadataLink = ({ icon, name, href, ...rest }: MetadataLinkProps) => {
  if (href === undefined) {
    href = "https://open.coki.ac";
  }

  return (
    <Link href={href} {...rest}>
      <Flex align="center" role="group" cursor="pointer">
        <Icon mr="2" icon={icon} size={32} color={"#101820"} />
        <Text textStyle="entityIconLink">{name}</Text>
      </Flex>
    </Link>
  );
};

interface EntityMetadataProps extends BoxProps {
  entity: Entity;
  isMobile: boolean;
}

const EntityMetadata = ({ entity, isMobile, ...rest }: EntityMetadataProps) => {
  // Include wikipedia and or website URLs if they exist for the entity
  let wikipedia = <></>;
  if (entity.wikipedia_url) {
    wikipedia = (
      <MetadataLink
        icon={"wikipedia"}
        name={"Wikipedia"}
        target="_blank"
        rel="noreferrer"
        href={entity.wikipedia_url}
      />
    );
  }

  let website = <></>;
  if (entity.url) {
    //TODO: clean urls in workflow
    if (entity.url.endsWith("//")) {
      entity.url = entity.url.slice(0, -1);
    }

    website = <MetadataLink icon={"website"} name={"Website"} target="_blank" rel="noreferrer" href={entity.url} />;
  }

  // Create tags
  let tags = [];
  if (entity.category === "institution") {
    tags.push(entity.country);
    tags = tags.concat(entity.institution_types);
  } else {
    tags.push(entity.subregion);
    tags.push(entity.region);
  }

  let content;
  if (isMobile) {
    content = (
      <Box {...rest}>
        <hr />
        <VStack px="12px" py="32px">
          <Flex w="full" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {wikipedia}
            {website}
            <MetadataLink icon={"download"} name={"Download"} href={"/data/"} />
            <MetadataLink icon={"code"} name={"Embed"} href={`/${entity.category}/${entity.id}/`} />
          </Flex>

          <Flex w="full" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            {entity.identifiers.map((obj: any) => {
              return (
                <Text key={obj.id} textStyle="entityID">
                  {obj.type}:{" "}
                  <Text as="span" textStyle="entityBold">
                    {obj.id}
                  </Text>
                </Text>
              );
            })}
          </Flex>
        </VStack>
      </Box>
    );
  } else {
    content = (
      <EntityCard display={{ base: "none", md: "block" }} {...rest}>
        <Flex h="full" flexDirection="column" justifyContent="space-between">
          {wikipedia}
          {website}
          <MetadataLink icon={"download"} name={"Download"} href={"/data/"} />
          <MetadataLink icon={"code"} name={"Embed"} href={`/${entity.category}/${entity.id}/`} />

          {tags.map((tag: any) => {
            return (
              <Tag size={"md"} key={tag} borderRadius="full" variant="solid" backgroundColor="#737373">
                <TagLabel margin={"auto"}>{tag}</TagLabel>
              </Tag>
            );
          })}
        </Flex>
      </EntityCard>
    );
  }

  return <>{content} </>;
};

interface StatsProps extends StackProps {
  statsTitle: ReactElement;
  value: number;
  isPercent?: boolean;
}

const Stats = ({ statsTitle, value, isPercent, ...rest }: StatsProps) => {
  let percent = "";
  if (isPercent) {
    percent = "%";
  }

  return (
    <VStack alignItems={"left"} spacing="0" {...rest}>
      <hr className={styles.hr} />
      <Text textStyle="entityStatsHeading" pb={"6px"}>
        {statsTitle}
      </Text>
      <Text textStyle="entityStatsValue">
        {toReadableNumber(value)}
        {percent}
      </Text>
    </VStack>
  );
};

interface EntityStatsProps extends BoxProps {
  entity: Entity;
}

const EntityStats = ({ entity, ...rest }: EntityStatsProps) => {
  let titleOpenPercentNoBr = <>Open Access Percentage</>;
  let titleOpenPercent = (
    <>
      Open Access <br /> Percentage
    </>
  );
  let titleNOutputs = (
    <>
      Total <br /> Publications
    </>
  );
  let titleNOutputsOpen = (
    <>
      Total Open <br /> Publications
    </>
  );
  let titleNCitations = (
    <>
      Total <br /> Citations
    </>
  );
  const p_open = Math.round(entity.stats.p_outputs_open);
  return (
    <Box {...rest}>
      {/*base*/}
      <VStack display={{ base: "block", md: "none" }}>
        <EntityCard w={"full"}>
          <Flex justifyContent="center">
            <Flex alignItems="center">
              <DonutSparkline value={p_open} color={"#FF671C"} size={90} showText={false} pr={6} />
              <VStack alignItems={"left"} spacing="0">
                <hr className={styles.hr} />
                <Text textStyle="entityOAScoreHeading" pb={"6px"}>
                  {titleOpenPercentNoBr}
                </Text>
                <Text textStyle="entityOAScoreValue">{p_open}%</Text>
              </VStack>
            </Flex>
          </Flex>
        </EntityCard>

        <Grid gap={2} templateColumns="repeat(3, 1fr)">
          <EntityCard>
            <Stats statsTitle={titleNOutputs} value={entity.stats.n_outputs} />
          </EntityCard>

          <EntityCard>
            <Stats statsTitle={titleNOutputsOpen} value={entity.stats.n_outputs_open} />
          </EntityCard>

          <EntityCard>
            <Stats statsTitle={titleNCitations} value={entity.stats.n_citations} />
          </EntityCard>
        </Grid>
      </VStack>

      {/*sm*/}
      <EntityCard display={{ base: "none", md: "block" }}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" pr={"10px"}>
            <DonutSparkline value={p_open} color={"#FF671C"} size={90} showText={false} pr={6} />
            <Stats statsTitle={titleOpenPercent} value={p_open} isPercent />
          </Flex>
          <Stats statsTitle={titleNOutputs} value={entity.stats.n_outputs} pr={"10px"} />
          <Stats statsTitle={titleNOutputsOpen} value={entity.stats.n_outputs_open} pr={"10px"} />
          <Stats statsTitle={titleNCitations} value={entity.stats.n_citations} />
        </Flex>
      </EntityCard>
    </Box>
  );
};

interface PublisherOpenDonutProps extends BoxProps {
  data: Array<any>;
}

const PublisherOpenDonut = ({ data, ...rest }: PublisherOpenDonutProps) => {
  const fontFamily = "brandon-grotesque";
  const margin = 20;
  const [i, setIndex] = useState(0);

  const CentreText = ({ dataWithArc, centerX, centerY }: any) => {
    const data = dataWithArc[i];
    return (
      <text textAnchor="middle" y={centerY + 6}>
        <tspan x={centerX} dy="0em" style={{ fontSize: "48px", fontFamily: fontFamily, fontWeight: 900 }}>
          {data.value}%
        </tspan>
        <tspan
          x={centerX}
          dy="1.2em"
          style={{
            fontWeight: 900,
            fontSize: "16px",
            fontFamily: fontFamily,
            textTransform: "uppercase",
          }}
        >
          {data.label}
        </tspan>
      </text>
    );
  };

  return (
    <Box className="publisherOpenDonut" {...rest}>
      <Pie
        colors={{ datum: "data.color" }}
        innerRadius={0.6}
        width={300}
        height={300}
        tooltip={({ datum: { id, value, color } }) => <></>}
        margin={{ top: margin, right: margin, bottom: margin, left: margin }}
        data={data}
        layers={["arcs", CentreText]}
        onMouseEnter={(node, event) => {
          // Set index, which is used by CentreText to decide which datapoint to render in the middle
          setIndex(node.arc.index);
        }}
        defs={[
          linearGradientDef("gold", [
            { offset: 0, color: "#fdd500" },
            { offset: 100, color: "#d1b100" },
          ]),
        ]}
        fill={[
          // match using object query
          { match: { id: "OA Journal" }, id: "gold" },
        ]}
      />
    </Box>
  );
};

interface OAPercentageChartProps extends BoxProps {
  data: Array<any>;
  startYear: number;
}

const OAPercentageChart = ({ data, startYear, ...rest }: OAPercentageChartProps) => {
  const props = {
    data: data,
    keys: ["Publisher Open", "Both", "Other Platform Open", "Closed"],
    margin: { top: 20, right: 20, bottom: 30, left: 37 },
    enableGridX: true,
    enableGridY: false,
    colors: ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"],
    colorBy: "index",
    fillOpacity: 0.8,
    width: 824,
    height: 400,
    axisLeft: {
      format: (value: number) => {
        return `${value}%`;
      },
    },
    axisBottom: {
      format: (value: number) => {
        return startYear + value;
      },
    },
    valueFormat: (value: number) => `${value.toFixed(0)}%`,
  };

  return (
    <div style={{ display: "flex" }} className="oaPercentageStream">
      <Stream offsetType="none" {...props} />
    </div>
  );
};

interface OAVolumeChartProps extends BoxProps {
  data: Array<any>;
  startYear: number;
}

export function formatVolumeChartYAxis(value: number) {
  if (value < 1e3) {
    return value;
  } else if (value < 1e9) {
    value = value / 1000;
    return `${value}k`;
  }
}

const OAVolumeChart = ({ data, startYear, ...rest }: OAVolumeChartProps) => {
  let labels = ["Open", "Closed"];
  let colors = ["#FF671C", "#EBEBEB"];
  const props = {
    data: data,
    keys: labels,
    indexBy: "year",
    margin: { top: 20, right: 20, bottom: 30, left: 53 },
    enableGridX: false,
    enableGridY: true,
    colors: colors,
    width: 824,
    enableLabel: false,
    height: 400,
    isInteractive: true,
    axisLeft: {
      format: (value: number) => {
        return formatVolumeChartYAxis(value);
      },
      legend: "Total Publications",
      legendPosition: "middle" as AxisLegendPosition,
      legendOffset: -48,
    },
  };

  return (
    <div style={{ display: "flex" }} className="oaPercentageStream">
      <Bar {...props} />
    </div>
  );
};

interface LegendProps extends BoxProps {
  labels: Array<string>;
  colors: Array<string>;
}

const Legend = ({ labels, colors, ...rest }: LegendProps) => {
  return (
    <Flex
      {...rest}
      flexWrap="wrap"
      w="full"
      justifyContent={{ base: "left", sm: "center" }}
      mt={{ base: "16px", md: 0 }}
      ml={{ base: "6px", md: 0 }}
    >
      {labels.map((label, i) => {
        const color = colors[i];
        return (
          <Flex key={label} layerStyle="chartKeyRow" mr="24px">
            <Box layerStyle="chartKeyBox" backgroundColor={color} />
            <Text textStyle="chartKeyHeader">{label}</Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default EntityDetails;
