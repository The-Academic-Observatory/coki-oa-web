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
  Flex,
  FlexProps,
  Grid,
  GridItem,
  HStack,
  Image,
  LinkProps,
  StackProps,
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

const minOATimeseriesYear = 2000;

interface CardProps extends BoxProps {
  children: ReactNode;
}

const EntityCard = ({ children, ...rest }: CardProps) => {
  return (
    <Box
      bg={"white"}
      border={"1px solid #EBEBEB"}
      p={{ base: "14px", sm: "24px" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

interface EntityDetailsProps {
  entity: Entity;
}

const EntityDetails = ({ entity, ...rest }: EntityDetailsProps) => {
  return (
    <Card maxWidth="970px" width="calc(100vw - 12px)" bgBase="none">
      <VStack spacing={"24px"}>
        <EntitySummary entity={entity} />
        <EntityBreakdown entity={entity} />
        <EntityOATimeseries entity={entity} />
        <EntityPublisherOpen entity={entity} />
      </VStack>
    </Card>
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
      <BreakdownSparkline
        values={values}
        colors={colors}
        width={"100%"}
        height={48}
        py={3}
        labels={labels}
      />
    </EntityCard>
  );
};

interface EntityOATimeseriesProps extends BoxProps {
  entity: Entity;
}

const EntityOATimeseries = ({ entity, ...rest }: EntityOATimeseriesProps) => {
  let data = entity.timeseries
    .filter((t) => {
      const year = parseInt(String(t.year));
      return year >= minOATimeseriesYear;
    })
    .map((t) => {
      const stats = t.stats;
      return {
        "Publisher Open": stats.p_outputs_publisher_open_only,
        Both: stats.p_outputs_both,
        "Other Platform Open": stats.p_outputs_other_platform_open_only,
        Closed: stats.p_outputs_closed,
      };
    });

  return (
    <EntityCard width={"full"} {...rest}>
      <Text textStyle="entityCardHeading">
        Percentage of Open Access Over Time
      </Text>
      {/*<Box overflowX="scroll">*/}
      <Box>
        {/*style={{height: "600px"}}*/}
        <OAPercentageStream data={data} />
      </Box>

      {/*</Box>*/}
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
      <Flex
        w={"full"}
        flexDirection={{ base: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
      >
        <PublisherOpenDonut data={data} />
        <Grid layerStyle="chartKeys">
          <GridItem borderTop="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box
                layerStyle="chartKeyBox"
                backgroundImage="linear-gradient(-135deg, #fdd500, #b9a436)"
              />
              <Text textStyle="chartKeyHeader">OA Journal</Text>
              <Text
                textStyle="chartKeyDescription"
                display={{ base: "none", sm: "block" }}
              >
                &nbsp;- published in open access journal
              </Text>
            </Flex>
          </GridItem>
          <GridItem borderTop="2px solid #EBEBEB">
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundColor="#ffd700" />
              <Text textStyle="chartKeyHeader">Hybrid</Text>
              <Text
                textStyle="chartKeyDescription"
                display={{ base: "none", sm: "block" }}
              >
                &nbsp;- subscription publisher, open license
              </Text>
            </Flex>
          </GridItem>
          <GridItem
            borderTop="2px solid #EBEBEB"
            borderBottom="2px solid #EBEBEB"
          >
            <Flex layerStyle="chartKeyRow">
              <Box layerStyle="chartKeyBox" backgroundColor="#f8eb8f" />
              <Text textStyle="chartKeyHeader">No Guarantees</Text>
              <Text
                textStyle="chartKeyDescription"
                display={{ base: "none", sm: "block" }}
              >
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
        <EntityMetadataMobile
          entity={entity}
          display={{ base: "block", md: "none" }}
        />
        <EntityStats entity={entity} />
      </Flex>
      <EntityMetadataDesktop
        entity={entity}
        width={"220px"}
        display={{ base: "none", md: "block" }}
      />
    </Flex>
  );
};

interface EntityHeadingProps extends StackProps {
  entity: Entity;
}

const EntityHeading = ({ entity, ...rest }: EntityHeadingProps) => {
  entity.description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  return (
    <VStack alignItems={"left"} pb={{ base: "24px", md: 0 }} {...rest}>
      <HStack pb={{ base: "12px", md: "48px" }}>
        <Image
          rounded="full"
          objectFit="cover"
          boxSize={{ base: "60px", md: "100px" }}
          src={entity.logo_l}
          alt={entity.name}
          mr={{ base: "10px", md: "24px" }}
          style={{
            filter: "drop-shadow( 0px 0px 10px rgba(0, 0, 0, .2))",
          }}
        />
        <VStack alignItems={"left"}>
          <Text textStyle="entityHeading">{entity.name}</Text>
          <Text textStyle="p" display={{ base: "none", md: "block" }}>
            {entity.description}
          </Text>
        </VStack>
      </HStack>
      <Text textStyle="p" display={{ base: "block", md: "none" }}>
        {entity.description}
      </Text>
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
    href = "https://coki.ac";
  }

  return (
    <Link href={href} target="_blank" rel="noreferrer" {...rest}>
      <Flex align="center" role="group" cursor="pointer">
        <Icon mr="2" icon={icon} size={32} color={"#101820"} />
        <Text textStyle="entityIconLink">{name}</Text>
      </Flex>
    </Link>
  );
};

interface EntityMetadataDesktopProps extends BoxProps {
  entity: Entity;
}

const EntityMetadataDesktop = ({
  entity,
  ...rest
}: EntityMetadataDesktopProps) => {
  return (
    <EntityCard display={{ base: "none", md: "block" }} {...rest}>
      <Flex h="full" flexDirection="column" justifyContent="space-between">
        <MetadataLink
          icon={"wikipedia"}
          name={"Wikipedia"}
          href={entity.wikipedia_url}
        />
        <MetadataLink
          icon={"website"}
          name={"Website"}
          href={"https://coki.ac"}
        />
        <MetadataLink
          icon={"download"}
          name={"Download"}
          href={"https://coki.ac"}
        />
        <MetadataLink
          icon={"code"}
          name={"Embed"}
          href={"https://coki.ac"}
          mb="12px"
        />

        <Text textStyle="entityID">
          ROR:{" "}
          <Text as="span" textStyle="entityBold">
            02n415q13
          </Text>
        </Text>
        <Text textStyle="entityID">
          ISNI:{" "}
          <Text as="span" textStyle="entityBold">
            0000000403723343
          </Text>
        </Text>
        <Text textStyle="entityID">
          Crossref Funder ID:{" "}
          <Text as="span" textStyle="entityBold">
            501100001537
          </Text>
        </Text>
        <Text textStyle="entityID">
          WikiData:{" "}
          <Text as="span" textStyle="entityBold">
            Q492467
          </Text>
        </Text>
      </Flex>
    </EntityCard>
  );
};

interface EntityMetadataMobileProps extends BoxProps {
  entity: Entity;
}

const EntityMetadataMobile = ({
  entity,
  ...rest
}: EntityMetadataMobileProps) => {
  return (
    <Box {...rest}>
      <hr />
      <VStack px="12px" py="32px">
        <Flex
          w="full"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <MetadataLink
            icon={"wikipedia"}
            name={"Wikipedia"}
            href={"https://coki.ac"}
          />
          <MetadataLink
            icon={"website"}
            name={"Website"}
            href={"https://coki.ac"}
          />
          <MetadataLink
            icon={"download"}
            name={"Download"}
            href={"https://coki.ac"}
          />
          <MetadataLink icon={"code"} name={"Embed"} href={"https://coki.ac"} />
        </Flex>

        <Flex
          w="full"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <Text textStyle="entityID">
            ROR:{" "}
            <Text as="span" textStyle="entityBold">
              02n415q13
            </Text>
          </Text>
          <Text textStyle="entityID">
            ISNI:{" "}
            <Text as="span" textStyle="entityBold">
              0000000403723343
            </Text>
          </Text>
          <Text textStyle="entityID">
            Crossref Funder ID:{" "}
            <Text as="span" textStyle="entityBold">
              501100001537
            </Text>
          </Text>
          <Text textStyle="entityID">
            WikiData:{" "}
            <Text as="span" textStyle="entityBold">
              Q492467
            </Text>
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
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
  let titleOpenPercentNoBr = <>Open Access % Score</>;
  let titleOpenPercent = (
    <>
      Open Access <br /> % Score
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
              <DonutSparkline
                value={p_open}
                color={"#FF671C"}
                size={90}
                showText={false}
                pr={6}
              />
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
            <Stats
              statsTitle={titleNOutputsOpen}
              value={entity.stats.n_outputs_open}
            />
          </EntityCard>

          <EntityCard>
            <Stats
              statsTitle={titleNCitations}
              value={entity.stats.n_citations}
            />
          </EntityCard>
        </Grid>
      </VStack>

      {/*sm*/}
      <EntityCard display={{ base: "none", md: "block" }}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" pr={"10px"}>
            <DonutSparkline
              value={p_open}
              color={"#FF671C"}
              size={90}
              showText={false}
              pr={6}
            />
            <Stats statsTitle={titleOpenPercent} value={p_open} isPercent />
          </Flex>
          <Stats
            statsTitle={titleNOutputs}
            value={entity.stats.n_outputs}
            pr={"10px"}
          />
          <Stats
            statsTitle={titleNOutputsOpen}
            value={entity.stats.n_outputs_open}
            pr={"10px"}
          />
          <Stats
            statsTitle={titleNCitations}
            value={entity.stats.n_citations}
          />
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
        <tspan
          x={centerX}
          dy="0em"
          style={{ fontSize: "48px", fontFamily: fontFamily, fontWeight: 900 }}
        >
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

interface OAPercentageStreamProps extends BoxProps {
  data: Array<any>;
}

const OAPercentageStream = ({ data, ...rest }: OAPercentageStreamProps) => {
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
        return minOATimeseriesYear + value;
      },
    },
    valueFormat: (value: number) => `${value.toFixed(0)}%`,
  };

  return (
    <div style={{ display: "flex" }} className="oaProportionStream">
      <Stream offsetType="none" {...props} />
    </div>
  );
};

export default EntityDetails;
