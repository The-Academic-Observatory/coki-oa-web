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

import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Card from "../components/common/Card";
import CurtinLogo from "../public/logo-curtin.svg";
import MellonLogo from "../public/logo-mellon.svg";
import ArcadiaLogo from "../public/logo-arcadia.svg";
import Head from "next/head";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function About() {
  return (
    <Box layerStyle="page">
      <Head>
        <title>COKI: About</title>
        <meta name="description" content="About the Curtin Open Knowledge Initiative." />
      </Head>

      <Breadcrumbs
        breadcrumbs={[
          {
            title: "About",
            href: "/about/",
          },
        ]}
      />

      <Card>
        <Text as="h1" textStyle="h1">
          About
        </Text>

        <Text textStyle="p">
          “Our goal is to change the stories that universities tell about themselves, and to put open knowledge at the
          heart of that narrative”
        </Text>
        <Text textStyle="p">
          We believe the future role of the university is as an Open Knowledge Institution, a platform for supporting
          groups to come together and create and apply knowledge. Knowledge-making for, and with society, requires us to
          rethink the boundaries of our institutions and to create systems that support effective communication,
          diversity and coordination amongst groups.
        </Text>
        <Text textStyle="p">
          Open Access to research outputs is one small, but important part of an effective Open Knowledge Institution.
          By providing timely, transparent and useful information on open access performance we aim to support advocates
          in making the case for change, to provide data to decision makers and to change our shared ideas of what makes
          a good university.
        </Text>
        <Text textStyle="p" layerStyle="pGap">
          The Curtin Open Knowledge Initiative (COKI) is a strategic initiative of the Research Office at Curtin, the
          Faculty of Humanities, School of Media, Creative Arts and Social Inquiry and the Curtin Institute for
          Computation, with additional support from the Andrew W. Mellon Foundation and Arcadia, a charitable fund of
          Lisbet Rausing and Peter Baldwin.
        </Text>

        <Text as="h2" textStyle="h2">
          Funders
        </Text>
        <Flex
          alignItems="center"
          align="center"
          flexWrap="wrap"
          direction="row"
          justifyContent={{ base: "center", md: "space-between" }}
        >
          <Box layerStyle="logo">
            <CurtinLogo />
          </Box>

          <Box layerStyle="logo">
            <MellonLogo />
          </Box>

          <Box layerStyle="logo">
            <ArcadiaLogo />
          </Box>
        </Flex>
      </Card>
    </Box>
  );
}
