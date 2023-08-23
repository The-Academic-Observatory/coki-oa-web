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

import { Box, ListItem, Table, Tbody, Td, Text, Th, Thead, Tr, UnorderedList } from "@chakra-ui/react";
import React from "react";
import Card from "../components/common/Card";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ScrollTable from "../components/common/ScrollTable";
import { OADataLocal } from "../lib/api";
import { Stats } from "../lib/model";
import Head from "../components/common/Head";

export async function getStaticProps() {
  const client = new OADataLocal();
  return {
    props: {
      stats: client.getStats(),
    },
  };
}

type Props = {
  stats: Stats;
};

export default function Data({ stats }: Props) {
  const maxVersions = 5;
  const title = "COKI: Data";
  const description = "The COKI Open Access Dataset is available in JSON Lines format.";

  return (
    <Box layerStyle="page">
      {/* This component contains the Head tag for the page. */}
      <Head title={title} description={description} />

      <Breadcrumbs
        breadcrumbs={[
          {
            title: "Data",
            href: "/data/",
          },
        ]}
      />

      <Card>
        <Text as="h1" textStyle="h1">
          Data
        </Text>
        <Text textStyle="p">
          The COKI Open Access Dataset is available in{" "}
          <a href="https://jsonlines.org/" target="_blank" rel="noreferrer">
            JSON Lines
          </a>{" "}
          format. See below for dataset releases, license, how to cite the website and dataset, attributions and the
          dataset schema.
        </Text>
        <Text textStyle="h2">Releases</Text>
        <ScrollTable mb="32px">
          <Table variant="content">
            <Tbody>
              {stats.zenodo_versions.slice(0, maxVersions).map((version, i) => (
                <Tr key={i}>
                  <Td>{version.release_date}</Td>
                  <Td>
                    <a href={version.download_url}>Download coki-oa-dataset.zip</a>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ScrollTable>
        <Text as="h2" textStyle="h2">
          License
        </Text>
        <Text textStyle="p">
          The{" "}
          <a href="https://open.coki.ac/data/" target="_blank" rel="noreferrer">
            COKI Open Access Dataset
          </a>{" "}
          © 2022 by{" "}
          <a href="https://www.curtin.edu.au/" target="_blank" rel="noreferrer">
            Curtin University
          </a>{" "}
          is licensed under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
          .
        </Text>

        <Text textStyle="h2">Citing</Text>
        <Text textStyle="p">To cite the COKI Open Access Dashboard please use the following citation:</Text>
        <Text textStyle="p" pb="24px" px={{ base: "12px", md: "32px" }}>
          Diprose, J., Hosking, R., Rigoni, R., Roelofs, A., Chien, T., Napier, K., Wilson, K., Huang, C., Handcock, R.,
          Montgomery, L., & Neylon, C. (2023). A User-Friendly Dashboard for Tracking Global Open Access Performance.
          The Journal of Electronic Publishing 26(1). doi:{" "}
          <a href="https://doi.org/10.3998/jep.3398" target="_blank" rel="noreferrer">
            https://doi.org/10.3998/jep.3398
          </a>
        </Text>

        <Text textStyle="p">If you use the website code, please cite it as below:</Text>
        <Text textStyle="p" pb="24px" px={{ base: "12px", md: "32px" }}>
          James P. Diprose, Richard Hosking, Richard Rigoni, Aniek Roelofs, Alex Massen-Hane, Kathryn R. Napier,
          Tuan-Yow Chien, Katie S. Wilson, Lucy Montgomery, & Cameron Neylon. (2022). COKI Open Access Website. Zenodo.{" "}
          <a href="https://doi.org/10.5281/zenodo.6374486" target="_blank" rel="noreferrer">
            https://doi.org/10.5281/zenodo.6374486
          </a>
        </Text>

        <Text textStyle="p">If you use this dataset, please cite it as below:</Text>
        <Text textStyle="p" pb="24px" px={{ base: "12px", md: "32px" }}>
          Richard Hosking, James P. Diprose, Aniek Roelofs, Tuan-Yow Chien, Lucy Montgomery, & Cameron Neylon. (2022).
          COKI Open Access Dataset [Data set]. Zenodo.{" "}
          <a href="https://doi.org/10.5281/zenodo.6399462" target="_blank" rel="noreferrer">
            https://doi.org/10.5281/zenodo.6399462
          </a>
        </Text>

        <Text textStyle="p">For other citation formats follow the doi.org links in the above citations.</Text>

        <Text as="h2" textStyle="h2">
          Dataset Attributions
        </Text>
        <Text textStyle="p">The COKI Open Access Dataset contains information from:</Text>
        <UnorderedList textStyle="p" spacing="16px">
          <ListItem>
            <a href="https://openalex.org/" target="_blank" rel="noreferrer">
              OpenAlex
            </a>{" "}
            which is made available under the{" "}
            <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">
              CC0 licence
            </a>
            .
          </ListItem>
          <ListItem>
            <a href="https://www.crossref.org/documentation/metadata-plus/" target="_blank" rel="noreferrer">
              Crossref Metadata
            </a>{" "}
            via the Metadata Plus program. Bibliographic metadata is made available without copyright restriction and
            Crossref generated data under a{" "}
            <a href="https://creativecommons.org/share-your-work/public-domain/cc0/" target="_blank" rel="noreferrer">
              CC0 licence
            </a>
            . See{" "}
            <a
              href="https://www.crossref.org/documentation/retrieve-metadata/rest-api/rest-api-metadata-license-information/"
              target="_blank"
              rel="noreferrer"
            >
              metadata licence information
            </a>{" "}
            for more details.
          </ListItem>
          <ListItem>
            <a href="https://unpaywall.org/" target="_blank" rel="noreferrer">
              Unpaywall
            </a>
            . The{" "}
            <a href="https://unpaywall.org/products/data-feed" target="_blank" rel="noreferrer">
              Unpaywall Data Feed
            </a>{" "}
            is used under license. Data is freely available from Unpaywall via the API, data dumps and as a data feed.
          </ListItem>
          <ListItem>
            <a href="https://ror.org/" target="_blank" rel="noreferrer">
              Research Organization Registry
            </a>{" "}
            which is made available under a{" "}
            <a href="https://creativecommons.org/share-your-work/public-domain/cc0/" target="_blank" rel="noreferrer">
              CC0 licence
            </a>{" "}
            .
          </ListItem>
        </UnorderedList>

        <Text as="h2" textStyle="h2">
          Schema
        </Text>
        <ScrollTable caption="Table 1. Country Schema." mb="32px">
          <Table variant="content" mt={0}>
            <Thead>
              <Tr>
                <Th>Field</Th>
                <Th>Type</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>id</Td>
                <Td>String</Td>
                <Td>The country id; an ISO 3166-1 alpha-3 country code.</Td>
              </Tr>
              <Tr>
                <Td>name</Td>
                <Td>String</Td>
                <Td>The country name.</Td>
              </Tr>
              <Tr>
                <Td>subregion</Td>
                <Td>String</Td>
                <Td>The name of the subregion the country is located in.</Td>
              </Tr>
              <Tr>
                <Td>region</Td>
                <Td>String</Td>
                <Td>The name of the region the country is located in.</Td>
              </Tr>
              <Tr>
                <Td>start_year</Td>
                <Td>Integer</Td>
                <Td>The start year of data used to calculate the statistics.</Td>
              </Tr>
              <Tr>
                <Td>end_year</Td>
                <Td>Integer</Td>
                <Td>The end year of data used to calculate the statistics.</Td>
              </Tr>
              <Tr>
                <Td>stats</Td>
                <Td>PublicationStats</Td>
                <Td>The aggregated publication statistics for this country, for all time.</Td>
              </Tr>
              <Tr>
                <Td>years</Td>
                <Td>List&#60;Year&#62;</Td>
                <Td>The publication statistics for each year.</Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <ScrollTable caption="Table 2. Institution Schema." mb="32px">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Field</Th>
                <Th>Type</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>id</Td>
                <Td>String</Td>
                <Td>
                  The institution id; a{" "}
                  <a href="https://ror.org/" target="_blank" rel="noreferrer">
                    Research Organization Registry identifier
                  </a>
                  .
                </Td>
              </Tr>
              <Tr>
                <Td>name</Td>
                <Td>String</Td>
                <Td>The institution name.</Td>
              </Tr>
              <Tr>
                <Td>country_name</Td>
                <Td>String</Td>
                <Td>The name of the country where the institution is located.</Td>
              </Tr>
              <Tr>
                <Td>country_code</Td>
                <Td>String</Td>
                <Td>The three letter an ISO 3166-1 alpha-3 code of the country where the institution is located.</Td>
              </Tr>
              <Tr>
                <Td>subregion</Td>
                <Td>String</Td>
                <Td>The name of the subregion where the institution is located.</Td>
              </Tr>
              <Tr>
                <Td>region</Td>
                <Td>String</Td>
                <Td>The name of the region where the institution is located.</Td>
              </Tr>
              <Tr>
                <Td>institution_types</Td>
                <Td>List&#60;String&#62;</Td>
                <Td>
                  A list of institution types that apply to this institution. Each instance can be one of: Education,
                  Healthcare, Company, Archive, Nonprofit, Government, Facility, Other.
                </Td>
              </Tr>
              <Tr>
                <Td>start_year</Td>
                <Td>Integer</Td>
                <Td>The start year of data used to calculate the statistics.</Td>
              </Tr>
              <Tr>
                <Td>end_year</Td>
                <Td>Integer</Td>
                <Td>The end year of data used to calculate the statistics.</Td>
              </Tr>
              <Tr>
                <Td>stats</Td>
                <Td>PublicationStats</Td>
                <Td>The aggregated publication statistics for this institution, for all time.</Td>
              </Tr>
              <Tr>
                <Td>years</Td>
                <Td>List&#60;Year&#62;</Td>
                <Td>The publication statistics for each year.</Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <ScrollTable caption="Table 3. PublicationStats Schema." mb="32px">
          <Table variant="content">
            <Thead textAlign="left">
              <Tr>
                <Th>Field</Th>
                <Th>Type</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>n_citations</Td>
                <Td>Integer</Td>
                <Td>The total number of outputs cited.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs</Td>
                <Td>Integer</Td>
                <Td>The total number of outputs published.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_open</Td>
                <Td>Integer</Td>
                <Td>The total number of open outputs.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_publisher_open</Td>
                <Td>Integer</Td>
                <Td>The total number of outputs published as Publisher Open.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_publisher_open_only</Td>
                <Td>Integer</Td>
                <Td>
                  The total number of outputs published only as Publisher Open (and not Other Platform Open or Closed).
                </Td>
              </Tr>
              <Tr>
                <Td>n_outputs_both</Td>
                <Td>Integer</Td>
                <Td>The total number of outputs published that are both Publisher Open and Other Platform Open.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_other_platform_open</Td>
                <Td>Integer</Td>
                <Td>The total number of outputs published as Other Platform Open.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_other_platform_open_only</Td>
                <Td>Integer</Td>
                <Td>
                  The total number of outputs published only as Other Platform Open (and not Publisher Open or Closed).
                </Td>
              </Tr>
              <Tr>
                <Td>n_outputs_closed</Td>
                <Td>Integer</Td>
                <Td>The total number of outputs published as Closed.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_oa_journal</Td>
                <Td>Integer</Td>
                <Td>Publisher Open Breakdown: the total number of outputs published in an Open Access Journal.</Td>
              </Tr>
              <Tr>
                <Td>n_outputs_hybrid</Td>
                <Td>Integer</Td>
                <Td>
                  Publisher Open Breakdown: the total number of outputs made accessible in a Subscription Journal with
                  an open license.
                </Td>
              </Tr>
              <Tr>
                <Td>n_outputs_no_guarantees</Td>
                <Td>Integer</Td>
                <Td>
                  Publisher Open Breakdown: the total number of outputs made accessible in a Subscription Publisher with
                  no reuse rights.
                </Td>
              </Tr>
              <Tr>
                <Td>p_outputs_open</Td>
                <Td>Float</Td>
                <Td>The percentage of open outputs.</Td>
              </Tr>
              <Tr>
                <Td>p_outputs_publisher_open</Td>
                <Td>Float</Td>
                <Td>The percentage of outputs published as Publisher Open.</Td>
              </Tr>
              <Tr>
                <Td>p_outputs_publisher_open_only</Td>
                <Td>Float</Td>
                <Td>
                  The percentage of outputs published only as Publisher Open (and not Other Platform Open or Closed).
                </Td>
              </Tr>
              <Tr>
                <Td>p_outputs_both</Td>
                <Td>Float</Td>
                <Td>The percentage of outputs published that are both Publisher Open and Other Platform Open.</Td>
              </Tr>
              <Tr>
                <Td>p_outputs_other_platform_open</Td>
                <Td>Float</Td>
                <Td>The percentage of outputs published as Other Platform Open.</Td>
              </Tr>
              <Tr>
                <Td>p_outputs_other_platform_open_only</Td>
                <Td>Float</Td>
                <Td>
                  The percentage of outputs published only as Other Platform Open (and not Publisher Open or Closed).
                </Td>
              </Tr>
              <Tr>
                <Td>p_outputs_closed</Td>
                <Td>Float</Td>
                <Td>The percentage of outputs published as Closed.</Td>
              </Tr>
              <Tr>
                <Td>p_outputs_oa_journal</Td>
                <Td>Float</Td>
                <Td>The percentage of Publisher Open outputs published in an Open Access Journal.</Td>
              </Tr>
              <Tr>
                <Td>p_outputs_hybrid</Td>
                <Td>Float</Td>
                <Td>
                  The percentage of Publisher Open outputs made accessible in a Subscription Journal with an open
                  license.
                </Td>
              </Tr>
              <Tr>
                <Td>p_outputs_no_guarantees</Td>
                <Td>Float</Td>
                <Td>
                  The percentage of Publisher Open outputs made accessible in a Subscription Publisher with no reuse
                  rights.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <ScrollTable caption="Table 4. Year Schema." mb="32px">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Field</Th>
                <Th>Type</Th>
                <Th>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>year</Td>
                <Td>Integer</Td>
                <Td>The year that this record applies to.</Td>
              </Tr>
              <Tr>
                <Td>date</Td>
                <Td>Date</Td>
                <Td>
                  The date that this record applies to, in the format YYYY-MM-DD. The day and month are always the end
                  of the year in question, i.e. the 31st of December.
                </Td>
              </Tr>
              <Tr>
                <Td>stats</Td>
                <Td>PublicationStats</Td>
                <Td>The aggregated publication statistics for the year that this record applies to.</Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>
      </Card>
    </Box>
  );
}
