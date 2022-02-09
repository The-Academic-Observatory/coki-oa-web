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

import {
  Box,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import Card from "../components/Card";
import HowOverview from "../public/images/how-overview.svg";
import HowDatasets from "../public/images/how-datasets.svg";
import HowPubTable from "../public/images/how-pub-table.svg";
import Figure from "../components/Figure";
import ScrollTable from "../components/ScrollTable";
import Breadcrumb from "../components/Breadcrumb";
import Head from "next/head";

export default function How() {
  return (
    <Box layerStyle="page">
      <Head>
        <title>COKI: How it Works</title>
        <meta
          name="description"
          content="The COKI Open Access Dataset is created."
        />
      </Head>

      <Box display={{ base: "none", md: "block" }} pb="32px">
        <Breadcrumb labelsToUppercase />
      </Box>

      <Card>
        <Text textStyle="h1">How it Works</Text>
        <Text textStyle="p">
          The COKI Open Access Dataset measures open access performance for 195
          countries and over 5000 institutions. The COKI Open Access Dataset is
          created with the COKI Academic Observatory data collection pipeline,
          which fetches data about research publications from multiple sources,
          synthesises the datasets and creates the open access calculations for
          each country and institution.
        </Text>
        <Text textStyle="h2">1. Fetch Datasets</Text>
        <Text textStyle="p">
          Each week we collect a number of specialised research publication
          datasets. These include Crossref Metadata, Crossref Funder Registry,
          Crossref Events, Microsoft Academic Graph, Unpaywall, the Research
          Organization Registry, Open Citations and Geonames. The table below
          illustrates what each dataset is used for.
        </Text>
        <ScrollTable caption="Table 1. Datasets and their roles.">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Dataset</Th>
                <Th>Role</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Crossref Metadata</Td>
                <Td>Citations, Paper Title, Journal Name</Td>
              </Tr>
              <Tr>
                <Td>Crossref Funder Registry</Td>
                <Td>Funder</Td>
              </Tr>
              <Tr>
                <Td>Crossref Events</Td>
                <Td>Social Media and Internet Events</Td>
              </Tr>
              <Tr>
                <Td>Microsoft Academic Graph</Td>
                <Td>Affiliation, Subject</Td>
              </Tr>
              <Tr>
                <Td>Unpaywall</Td>
                <Td>Open Access Status</Td>
              </Tr>
              <Tr>
                <Td>Research Organization Registry</Td>
                <Td>Institution Identifiers</Td>
              </Tr>
              <Tr>
                <Td>Open Citations</Td>
                <Td>Additional citation information</Td>
              </Tr>
              <Tr>
                <Td>Geonames</Td>
                <Td>Geographic information</Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>
        <Text textStyle="h2">2. Synthesis</Text>
        <Text textStyle="p">
          After fetching the datasets, they are synthesised to produce aggregate
          time series statistics for each country and institution (entity type)
          in the dataset. The aggregate timeseries statistics include
          publication count, open access status, citation count and alt-metrics.{" "}
        </Text>
        <Text textStyle="p">
          The synthesis occurs in three steps (Figure 1):{" "}
        </Text>
        <OrderedList textStyle="p">
          <ListItem>Creating a table of publications.</ListItem>
          <ListItem>
            Grouping the publications by entity type and year of publication.
          </ListItem>
          <ListItem>
            Computing aggregated summaries for each group. Each step of the
            process is explained below with examples.
          </ListItem>
        </OrderedList>

        <Figure caption="Figure 1. COKI dataset analysis pipeline.">
          <HowOverview />
        </Figure>

        <Text textStyle="p">
          The table of publications is created by joining records from the
          research publication datasets on Digital Object Identifiers (DOIs);
          unique digital identifiers given to the majority of publications.
          Figure 2 illustrates how each dataset contributes to the publications
          table during the joining process, using the example of a single
          publication. Unique publications are discovered with Crossref
          Metadata, from which the publication’s DOI, Journal, Publisher, Funder
          identifiers and citation counts are derived. The publication’s Open
          Access status is computed using Unpaywall. The authors of the paper
          and their institutional affiliations are derived with Microsoft
          Academic Graph. The Research Organisation Registry (ROR) is used to
          enrich the institutional affiliation records with institution details
          and GeoNames maps institutions to countries and regions.
        </Text>

        <Figure
          maxWidth="650px"
          caption="Figure 2. How each dataset contributes to the publications table."
        >
          <HowDatasets />
        </Figure>

        <Text textStyle="p">
          Once the publications table has been created, the publications are
          grouped by entity type and publication year. For instance, as shown in
          Figure 3 below, publications are grouped by institution and
          publication year. The last step involves creating aggregate timeseries
          statistics based on the yearly groups of publications.
        </Text>

        <Figure
          maxWidth="1000px"
          caption="Figure 3. How the publications table is created."
        >
          <HowPubTable />
        </Figure>

        <Text textStyle="h2">3. Open Access Calculations</Text>
        <Text textStyle="p">
          The Unpaywall dataset is used to calculate Open Access status, the
          calculations for Publisher Open, Other Platform Open and Closed Access
          are described in Table 2 below.
        </Text>

        <ScrollTable caption="Table 2. Open Access status calculations.">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Unpaywall Query Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Publisher Open</Td>
                <Td>
                  An article published in an Open Access Journal or made
                  accessible in a Subscription Journal.
                </Td>
                <Td>
                  Where the Unpaywall journal_is_in_doaj field is True or where
                  the Unpaywall best_oa_location location_type field is
                  “publisher”.
                </Td>
              </Tr>
              <Tr>
                <Td>Other Platform Open</Td>
                <Td>
                  The publication was shared online; on a preprint server, a
                  university library repository, domain repository or an
                  academic staff page.
                </Td>
                <Td>
                  Any article where any oa_location element in the Unpaywall
                  data has the location_type “repository”.
                </Td>
              </Tr>
              <Tr>
                <Td>Closed</Td>
                <Td>
                  A publication that is not either Publisher Open or Other
                  Platform Open.
                </Td>
                <Td>
                  Where journal_is_in_doaj is False and best_oa_location is
                  null.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <Text textStyle="p">
          The calculations for the Publisher Open subcategories are described in
          Table 3 below.
        </Text>

        <ScrollTable caption="Table 3. Publisher Open subcategory calculations.">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Unpaywall Query Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>OA Journal</Td>
                <Td>Published in an Open Access Journal.</Td>
                <Td>
                  We use the journal_is_in_doaj tag from Unpaywall to define
                  this category which requires that there be some licensing
                  information provided.
                </Td>
              </Tr>
              <Tr>
                <Td>Hybrid</Td>
                <Td>
                  Made accessible in a Subscription Journal with an open
                  license.
                </Td>
                <Td>
                  We check that the license field for the best_oa_location is
                  not null and journal_is_in_doaj is False. This includes the
                  value of “implied_oa” which covers cases where publishers have
                  a general assertion of a license but it is not clear from the
                  page.
                </Td>
              </Tr>
              <Tr>
                <Td>No Guarantees</Td>
                <Td>
                  Made accessible in a Subscription Publisher with no reuse
                  rights.
                </Td>
                <Td>
                  All cases where the best_oa_location is “publisher”, the
                  license field is null, and journal_is_in_doaj is False.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <Text textStyle="p">
          To see the SQL script that calculates Open Access status,{" "}
          <a
            href="https://github.com/The-Academic-Observatory/academic-observatory-workflows/blob/develop/academic_observatory_workflows/database/sql/create_unpaywall.sql.jinja2"
            target="_blank"
            rel="noreferrer"
          >
            follow this link.
          </a>
        </Text>
        <Text textStyle="h2">4. Limitations</Text>
        <Text textStyle="p">The limitations of our methodology include:</Text>
        <UnorderedList textStyle="p">
          <ListItem>
            Research outputs that do not have an associated DOI are not included
            in this analysis. While this means we did consider the contribution
            of over 100 million outputs, there is still a substantial
            contribution to the scholarly record not currently covered by this
            identifier system.{" "}
          </ListItem>
          <ListItem>
            Funder data only exists from the commencement of the Crossref
            Fundref initiative and is not complete, with quality diminishing the
            further back in time you go.
          </ListItem>
          <ListItem>
            Microsoft Academic Graph, the bibliographic data source, has
            substantial biases and limitations with respect to affiliation
            sources.
          </ListItem>
        </UnorderedList>
      </Card>
    </Box>
  );
}
