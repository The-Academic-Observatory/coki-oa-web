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

import { Box, ListItem, OrderedList, Table, Tbody, Td, Text, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react";
import React from "react";
import Card from "../components/common/Card";
import HowOverview from "../public/images/how-overview.svg";
import HowDatasets from "../public/images/how-datasets.svg";
import HowPubTable from "../public/images/how-pub-table.svg";
import Figure from "../components/common/Figure";
import ScrollTable from "../components/common/ScrollTable";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { getStatsData } from "../lib/api";
import { Stats } from "../lib/model";
import Link from "../components/common/Link";
import MetadataTags from "../components/details/MetadataTags";

export async function getStaticProps() {
  const stats = getStatsData();
  return {
    props: {
      stats: stats,
    },
  };
}

type Props = {
  stats: Stats;
};

export default function How({ stats }: Props) {
  const pageTitle = "COKI: How it Works";
  const pageDescription = "The COKI Open Access Dataset is created.";

  return (
    <Box layerStyle="page">
      {/* This component contains the Head tag for the page. */}
      <MetadataTags title={pageTitle} description={pageDescription} />

      <Breadcrumbs
        breadcrumbs={[
          {
            title: "How it Works",
            href: "/how/",
          },
        ]}
      />

      <Card>
        <Text as="h1" textStyle="h1">
          How it Works
        </Text>
        <Text textStyle="p">
          The <Link href="/data">COKI Open Access Dataset</Link> measures open access performance for{" "}
          {stats.country.n_items} countries and {stats.institution.n_items} institutions. This dataset includes
          countries having at least {stats.country.min.n_outputs} research outputs and institutions with at least{" "}
          {stats.institution.min.n_outputs} research outputs. The COKI Open Access Dataset is created with the COKI
          Academic Observatory data collection pipeline, which fetches data about research publications from multiple
          sources, synthesises the datasets and creates the open access calculations for each country and institution.
          The data is then visualised in this website. The code for this website is available at the{" "}
          <a href="https://github.com/The-Academic-Observatory/coki-oa-web" target="_blank" rel="noreferrer">
            COKI Open Access Website
          </a>{" "}
          Github project.
        </Text>
        <Text as="h2" textStyle="h2">
          1. Fetch Datasets
        </Text>
        <Text textStyle="p">
          Each week we collect a number of specialised research publication datasets. These include Crossref Metadata,
          Crossref Funder Registry, Crossref Events, Microsoft Academic Graph (MAG), Unpaywall, the Research
          Organization Registry (ROR) and Open Citations. A subset of these datasets are used to produce the data for
          this website and the COKI Open Access Dataset, including Crossref Metadata, MAG, Unpaywall and the ROR. The
          table below illustrates what each dataset is used for.
        </Text>
        <ScrollTable caption="Table 1. Datasets and their roles." mb="32px">
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
            </Tbody>
          </Table>
        </ScrollTable>
        <Text as="h2" textStyle="h2">
          2. Synthesis
        </Text>
        <Text textStyle="p">
          After fetching the datasets, they are synthesised to produce aggregate time series statistics for each country
          and institution (entity type) in the dataset. The aggregate timeseries statistics include publication count,
          open access status, citation count and alt-metrics.{" "}
        </Text>
        <Text textStyle="p">The synthesis occurs in three steps (Figure 1): </Text>
        <OrderedList textStyle="p">
          <ListItem>Creating a table of publications.</ListItem>
          <ListItem>Grouping the publications by entity type and year of publication.</ListItem>
          <ListItem>
            Computing aggregated summaries for each group. Each step of the process is explained below with examples.
          </ListItem>
        </OrderedList>

        <Figure caption="Figure 1. COKI dataset analysis pipeline.">
          <HowOverview />
        </Figure>

        <Text textStyle="p">
          The table of publications is created by joining records from the research publication datasets on Digital
          Object Identifiers (DOIs); unique digital identifiers given to the majority of publications. Figure 2
          illustrates how each dataset contributes to the publications table during the joining process, using the
          example of a single publication. Unique publications are discovered with Crossref Metadata, from which the
          publication’s DOI, Journal, Publisher, Funder identifiers and citation counts are derived. The publication’s
          Open Access status is computed using Unpaywall. The authors of the paper and their institutional affiliations
          are derived with MAG. ROR is used to enrich the institutional affiliation records with institution details and
          map institutions to countries and regions. The COKI Open Access Dataset uses the ROR assignment of country
          codes to institutions.
        </Text>

        <Figure maxWidth="650px" caption="Figure 2. How each dataset contributes to the publications table.">
          <HowDatasets />
        </Figure>

        <Text textStyle="p">
          Once the publications table has been created, the publications are grouped by entity type and publication
          year. For instance, as shown in Figure 3 below, publications are grouped by institution and publication year.
          The last step involves creating aggregate timeseries statistics based on the yearly groups of publications.
        </Text>

        <Figure maxWidth="1000px" caption="Figure 3. How the publications table is created.">
          <HowPubTable />
        </Figure>

        <Text as="h2" textStyle="h2">
          3. Open Access Calculations
        </Text>
        <Text textStyle="p">
          The Unpaywall dataset is used to calculate Open Access status, the calculations for Publisher Open, Other
          Platform Open and Closed Access are described in Table 2 below.
        </Text>

        <ScrollTable caption="Table 2. Open Access status calculations." mb="32px">
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
                <Td>An article published in an Open Access Journal or made accessible in a Subscription Journal.</Td>
                <Td>
                  Where the Unpaywall journal_is_in_doaj field is True or where the Unpaywall best_oa_location
                  location_type field is “publisher”.
                </Td>
              </Tr>
              <Tr>
                <Td>Other Platform Open</Td>
                <Td>
                  The publication was shared online; on a preprint server, a university library repository, domain
                  repository or an academic staff page.
                </Td>
                <Td>
                  Any article where any oa_location element in the Unpaywall data has the location_type “repository”.
                </Td>
              </Tr>
              <Tr>
                <Td>Closed</Td>
                <Td>A publication that is not either Publisher Open or Other Platform Open.</Td>
                <Td>Where journal_is_in_doaj is False and best_oa_location is null.</Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <Text textStyle="p">The calculations for the Publisher Open categories are described in Table 3 below.</Text>

        <ScrollTable caption="Table 3. Publisher Open category calculations." mb="32px">
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
                  We use the journal_is_in_doaj tag from Unpaywall to define this category which requires that there be
                  some licensing information provided.
                </Td>
              </Tr>
              <Tr>
                <Td>Hybrid</Td>
                <Td>Made accessible in a Subscription Journal with an open license.</Td>
                <Td>
                  We check that the license field for the best_oa_location is not null and journal_is_in_doaj is False.
                  This includes the value of “implied_oa” which covers cases where publishers have a general assertion
                  of a license but it is not clear from the page.
                </Td>
              </Tr>
              <Tr>
                <Td>No Guarantees</Td>
                <Td>Made accessible in a Subscription Publisher with no reuse rights.</Td>
                <Td>
                  All cases where the best_oa_location is “publisher”, the license field is null, and journal_is_in_doaj
                  is False.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <Text textStyle="p">
          The calculations for the Other Platform Open categories are described in Table 4 below. We maintain
        </Text>

        <ScrollTable caption="Table 4. Other Platform Open category calculations." mb="32px">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Query Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Institution</Td>
                <Td>
                  Publications placed in institutional repositories, which are archives for storing and distributing an
                  institution&apos;s research outputs. Includes repositories shared amongst multiple institutions.
                </Td>
                <Td>
                  Where we have manually matched a repository to an institution, or where
                  oa_locations.repository_institution matches a ROR id with the ROR affiliation matcher, or where the
                  domain from the pmh_id field matches a link from a ROR record.
                </Td>
              </Tr>
              <Tr>
                <Td>Preprint</Td>
                <Td>
                  Publications deposited on servers that do not make claims about formal peer review. Generally non-peer
                  reviewed manuscripts, including working papers on platforms such as arXiv, bioRxiv, SSRN, RePec etc.
                </Td>
                <Td>Where we have manually classified a repository as a preprint server.</Td>
              </Tr>
              <Tr>
                <Td>Domain</Td>
                <Td>
                  Publications from domain repositories, also known as disciplinary or subject repositories. A domain
                  repository contains publications from a specific subject area. Examples include PubMed Central, Europe
                  PMC and Econstor.
                </Td>
                <Td>Where we have manually classified a repository as a domain repository.</Td>
              </Tr>
              <Tr>
                <Td>Public</Td>
                <Td>
                  Publications from repositories that can be used by researchers from any domain and to deposit any form
                  of output, including pre-prints, published manuscripts and datasets. Semantic Scholar, Figshare and
                  Zenodo are a few examples.
                </Td>
                <Td>Where we have manually classified a repository as a public repository.</Td>
              </Tr>
              <Tr>
                <Td>Other Internet</Td>
                <Td>
                  Outputs on sites we have not classified. In practice these are copies identified by CiteSeer X which
                  is in turn indexed by Unpaywall. It may include publications on academic staff pages, blogs and social
                  networks. We do not directly track outputs on platforms such as academia.edu and researchgate.net.
                </Td>
                <Td>
                  Outputs found on CiteSeer X, which often point to academic staff pages and blogs. We do not currently
                  track outputs from academic social networks. Also includes outputs from repositories that we have not
                  yet classified.
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
        <Text as="h2" textStyle="h2">
          4. Limitations
        </Text>
        <Text textStyle="p">The limitations of our methodology include:</Text>
        <UnorderedList textStyle="p">
          <ListItem>
            Research outputs that do not have an associated DOI are not included in this analysis. While this means we
            did consider the contribution of over 100 million outputs, there is still a substantial contribution to the
            scholarly record not currently covered by this identifier system.{" "}
          </ListItem>
          <ListItem>
            Funder data only exists from the commencement of the Crossref Fundref initiative and is not complete, with
            quality diminishing the further back in time you go.
          </ListItem>
          <ListItem>
            Microsoft Academic Graph, used to link institutions to research outputs, has substantial biases and
            limitations with respect to affiliation sources.
          </ListItem>
        </UnorderedList>
      </Card>
    </Box>
  );
}
