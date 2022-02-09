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

import { Box, Text } from "@chakra-ui/react";
import React from "react";
import Card from "../components/Card";
import Breadcrumb from "../components/Breadcrumb";

export default function Open() {
  return (
    <Box
      m={{ base: 0, md: "50px auto 90px", std: "50px 40px 90px" }}
      maxWidth={{ base: "100%", md: "900px", std: "970px" }}
    >
      <Box display={{ base: "none", md: "block" }} pb="32px">
        <Breadcrumb labelsToUppercase />
      </Box>
      <Card>
        <Text textStyle="h1">Data</Text>
        <Text textStyle="p">
          The COKI Open Access Dataset is available in JSON Lines format
          compressed in tar.gz archives.
        </Text>
        <Text textStyle="h2">Current Release</Text>
        <Text textStyle="p">Coming soon!</Text>
        <Text textStyle="h2">Previous Releases</Text>
        <Text textStyle="p">Coming soon!</Text>
        <Text textStyle="h2">Schema</Text>
        <Text textStyle="p">Coming soon!</Text>
        <Text textStyle="h2">License</Text>
        <Text textStyle="p">Coming soon!</Text>
        <Text textStyle="h2">Citing</Text>
        <Text textStyle="p">Coming soon!</Text>
      </Card>
    </Box>
  );
}
