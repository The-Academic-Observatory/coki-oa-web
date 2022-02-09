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

import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";
import Card from "../components/Card";
import Icon from "../components/Icon";
import Breadcrumb from "../components/Breadcrumb";

export default function Contact() {
  return (
    <Box
      m={{ base: 0, md: "50px auto 90px", std: "50px 40px 90px" }}
      maxWidth={{ base: "100%", md: "900px", std: "970px" }}
    >
      <Box display={{ base: "none", md: "block" }} pb="32px">
        <Breadcrumb labelsToUppercase />
      </Box>

      <Card>
        <Text textStyle="h1">Contact</Text>
        <Text textStyle="p" mb="24px">
          <b>WE WOULD LOVE TO HEAR FROM YOU.</b>
        </Text>
        <UnorderedList textStyle="p">
          <ListItem>
            <b>Reports and Dashboards.</b> Get more detailed information about
            my country or institution’s Open Access performance. We can provide
            reports and more detail about your institution or country on demand.
            We also build dashboards and bespoke tools for partners.
          </ListItem>
          <ListItem>
            <b>Understand how we can improve.</b> COKI can provide consultancy
            and advice on policy implementation, resourcing and monitoring for
            improving levels and value of open access initiatives.
          </ListItem>
          <ListItem>
            <b>Community.</b> Support the development of community resources. We
            are actively seeking partners to work with us to sustain and develop
            our data resources and analytical capabilities.
          </ListItem>
          <ListItem>
            <b>Collaborate.</b> Collaborate on a research program. We have an
            active research program on open access and are keen to discuss
            potential collaborations that can exploit or improve our data
            capabilities
          </ListItem>
        </UnorderedList>

        <Flex alignItems="center" mt="24px">
          <Icon icon="email" size={32} />
          <Text pl={2} textStyle="p" mb={0}>
            <b>
              Please email us at:{" "}
              <a
                href="mailto:coki@curtin.edu.au"
                target="_blank"
                rel="noreferrer"
              >
                coki@curtin.edu.au
              </a>
            </b>
          </Text>
        </Flex>
      </Card>
    </Box>
  );
}
