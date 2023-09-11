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
import Card from "../components/common/Card";
import Icon from "../components/common/Icon";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Head from "../components/common/Head";
import { FiGithub } from "react-icons/fi";

export default function Contact() {
  const title = "COKI: Contact";
  const description = "Contact the Curtin Open Knowledge Initiative.";

  return (
    <Box layerStyle="page">
      {/* This component contains the Head tag for the page. */}
      <Head title={title} description={description} />

      <Breadcrumbs
        breadcrumbs={[
          {
            title: "Contact",
            href: "/contact/",
          },
        ]}
      />

      <Card>
        <Text as="h1" textStyle="h1">
          Contact
        </Text>
        <Text textStyle="p" mb="24px">
          <b>WE WOULD LOVE TO HEAR FROM YOU.</b>
        </Text>
        <UnorderedList textStyle="p" spacing="16px">
          <ListItem>
            <b>Reports and Dashboards.</b> Get more detailed information about my country or institution’s Open Access
            performance. We can provide reports and more detail about your institution or country on demand. We also
            build dashboards and bespoke tools for partners.
          </ListItem>
          <ListItem>
            <b>Understand how we can improve.</b> COKI can provide consultancy and advice on policy implementation,
            resourcing and monitoring for improving levels and value of open access initiatives.
          </ListItem>
          <ListItem>
            <b>Community.</b> Support the development of community resources. We are actively seeking partners to work
            with us to sustain and develop our data resources and analytical capabilities.
          </ListItem>
          <ListItem>
            <b>Collaborate.</b> Collaborate on a research program. We have an active research program on open access and
            are keen to discuss potential collaborations that can exploit or improve our data capabilities
          </ListItem>
        </UnorderedList>

        <Flex alignItems="center" mt="24px">
          <Icon icon="email" size={32} />
          <Text pl={2} textStyle="p" pb={0}>
            <b>
              Please email us at{" "}
              <a href="mailto:coki@curtin.edu.au" target="_blank" rel="noreferrer">
                coki@curtin.edu.au
              </a>
            </b>
          </Text>
        </Flex>
        <Flex alignItems="center" mt="32px">
          <FiGithub size={32} strokeWidth={0.8} style={{ minWidth: "32px", minHeight: "32px" }} />
          <Text pl={2} textStyle="p" pb={0}>
            <b>
              To report a bug or to discuss a feature request please submit a{"  "}
              <a href="https://github.com/The-Academic-Observatory/coki-oa-web/issues" target="_blank" rel="noreferrer">
                Github Issue
              </a>
            </b>
          </Text>
        </Flex>
      </Card>
    </Box>
  );
}
