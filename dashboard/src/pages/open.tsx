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

import { Breadcrumbs, Card, Figure, Head, ScrollTable } from "@/components/common";
import { Box, ListItem, OrderedList, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import OAFlowchart from "@root/public/images/oa-flowchart.svg";
import OAOverview from "@root/public/images/oa-overview.svg";
import OAStats from "@root/public/images/oa-stats.svg";
import React from "react";

export default function Open() {
  const title = "COKI: Open Access";
  const description = "What is Open Access? Why is Open Access important? What can we do to improve Open Access?";

  return (
    <Box layerStyle="page">
      {/* This component contains the Head tag for the page. */}
      <Head title={title} description={description} />

      <Breadcrumbs
        breadcrumbs={[
          {
            title: "Open Access",
            href: "/open/",
          },
        ]}
      />

      <Card>
        <Text as="h1" textStyle="h1">
          Open Access
        </Text>
        <Text as="h2" textStyle="h2">
          What is Open Access?
        </Text>
        <Text textStyle="p">
          Open Access means that a formal research output is available online to read and to reuse, free of most
          copyright restrictions. Efforts to make more research outputs available have been gathering pace, starting in
          the late 1990s, with increasing requirements from funders, governments and institutions over the past two
          decades, changes in publishing business models, and adoption of greater sharing by researchers.
        </Text>

        <Figure maxWidth="600px">
          <OAOverview />
        </Figure>

        <Text textStyle="p">
          There are broadly two ways in which a research output can be made more accessible and these are categorised
          based on where the accessible copy is. The publisher may make the final formal version available on their
          website (or their main hosting platform). Some journals are completely accessible, with every article being
          available, and some have a mixed model where some articles are accessible but others are only available to
          subscribers. Publishers also sometimes make articles accessible for a limited time or without any explicit
          re-use rights. This doesn’t qualify as “open access” because permanent access is not guaranteed. We call
          access through the publisher “Publisher Open” and divide this into “OA Journal”, “Hybrid” and “No Guarantees”.
          Publisher Open has traditionally been labelled as “Gold OA” but this label is so inconsistently applied
          (sometimes being used for OA Journals only, sometimes including hybrid) that we avoid it. The “No Guarantees”
          category is often referred to as “Bronze” which we avoid here for similar reasons.
        </Text>
        <Text textStyle="p">
          The second mode for open access is where a copy of the article is made available through a platform other than
          the publisher. We call this “Other Platform Open”. The article copy might be the final published and formatted
          version, the authors final manuscript after peer review, the submitted version or a preprint. It might be
          placed in an institutional repository, a disciplinary repository, a preprint repository or a general
          repository infrastructure. As long as the repository meets certain standards for inclusion, relating to
          reliability, technical capacity and preservation, all of these qualify for our analysis. This category is
          sometimes referred to as “Green OA” but again there is confusion about how this applied so we avoid the term.
          We do provide information on which repositories a copy is found in and what we can say about the version of
          that copy.
        </Text>
        <Text textStyle="p">
          Note that any given article can be either Publisher Open or Other Platform Open, both of these, or neither.
          Many other analyses only count Other Platform Open (“Green”) when an article is not Publisher Open (“Gold”).
          We separate these categories to emphasise that both are independent and valid pathways to making articles
          accessible with their own benefits for authors. Understanding both pathways independently is useful in
          identifying where to focus resources and effort to increase accessibility.
        </Text>
        <Text textStyle="p">
          Finally, we define an article as “Accessible” if it is either Publisher Open, Other Platform Open, or both.
          Closed publications are simply publications that do not qualify as accessible.
        </Text>
        <Text textStyle="p">See the flowchart below to determine the type of open access for a publication.</Text>

        <Figure maxWidth="800px">
          <OAFlowchart />
        </Figure>

        <Text as="h2" textStyle="h2">
          Why is Open Access important?
        </Text>
        <Text textStyle="p">
          Out of 66 million journal articles and conference papers published from 2010 to 2024, 50% are accessible in
          some form and <b>50% are Closed!</b> This means that academics and institutions that cannot afford
          to subscribe to expensive Subscription Journals{" "}
          <b>will struggle to read 50% of papers published in the last 15 years.</b> Not to mention the general public,
          businesses, and people in developing nations.
        </Text>

        <Figure>
          <OAStats />
        </Figure>

        <Text textStyle="p">
          Access benefits the authors of publications, the institutions to which they belong, and research as a whole.
          As an author, this publication model benefits you because there are no barriers to your potential audience.
          Institutions can also improve their visibility, increasing their exposure and influence. Open Access is
          advantageous to science and the global community since it allows everyone to study academic research, even
          people who might otherwise be unable to afford subscription journals. And most important of all, giving the
          entire globe instant access to current knowledge allows science to advance even quicker.
        </Text>
        <Text as="h2" textStyle="h2">
          What can we do about it?
        </Text>
        <Text textStyle="p">
          The good news is that we can all contribute to improving the situation! There are a few options to explore
          depending on your situation.
        </Text>
        <OrderedList textStyle="p" spacing="16px">
          <ListItem>
            If you&apos;re an author of previous work, you can go back and upload copies of your previous Closed
            publications to your institution&apos;s library repository or other public repositories to make them Other
            Platform Open.
          </ListItem>
          <ListItem>
            If you are involved in the development of new research, consider Open Access Publishers, Journals, or
            Proceedings when considering a publication venue. If a decent choice isn&apos;t available yet, consider the
            best possibilities for preprint servers in your field of study, or have a strategy in place for placing a
            copy onto a publicly accessible repository in parallel to publishing through a regular source.
          </ListItem>
          <ListItem>
            If you aren’t publishing research yourself, but have an interest in accessing published research, keep in
            mind that the majority of it is funded entirely or partially by public funding. Consider taking a proactive
            approach to bringing this issue to light. Support open access advocates by raising the issue of access and
            tell stories of how you have benefited from access to research outputs, or frustrations where you have not
            been able to.
          </ListItem>
        </OrderedList>
        <Text as="h2" textStyle="h2">
          Open Access categories
        </Text>
        <Text textStyle="p">
          Table 1 describes the Open Access categories used in the index tables, including Publisher Open, Other
          Platform Open and Closed Access.
        </Text>

        <ScrollTable caption="Table 1. Open Access categories." mb="32px">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Significance</Th>
                <Th>Mapping</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Publisher Open</Td>
                <Td>An article published in an Open Access Journal or made accessible in a Subscription Journal.</Td>
                <Td>
                  The final edited publication can be read directly from the publisher&apos;s website, usually
                  immediately on publication (for OA Journal or Hybrid).
                </Td>
                <Td>The sum of Gold, Hybrid and Bronze.</Td>
              </Tr>
              <Tr>
                <Td>Other Platform Open</Td>
                <Td>
                  The publication was shared online; on a preprint server, a university library repository, domain
                  repository or an academic staff page.
                </Td>
                <Td>
                  Can be applied to existing articles that are already published as well as new articles. Generally
                  without any cost.
                </Td>
                <Td>Green and Grey.</Td>
              </Tr>
              <Tr>
                <Td>Closed</Td>
                <Td>A publication that is not either Publisher Open or Other Platform Open.</Td>
                <Td>
                  To increase access to academic research, these are the publications that should be focused on to make
                  accessible by uploading an appropriate copy to a public repository.
                </Td>
                <Td>Not Open, Closed or Closed Access.</Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <Text textStyle="p">
          Table 2 provides a breakdown of the Publisher Open categories, as shown in the charts on institution and
          country details pages.
        </Text>

        <ScrollTable caption="Table 2. Publisher Open categories." mb="32px">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Significance</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>OA Journal</Td>
                <Td>Published in an Open Access Journal.</Td>
                <Td>
                  To qualify as an OA journal there must be clear re-use rights and certain quality measures need to be
                  validated by the Directory of Open Access Journals.
                </Td>
              </Tr>
              <Tr>
                <Td>Hybrid</Td>
                <Td>Made accessible in a Subscription Journal with an open license.</Td>
                <Td>
                  A route to making articles available in older journals that were historically subscription based and
                  have not transitioned to fully open access. Almost always involves payment of an APC or some form of
                  institutional payment through a “read and publish” agreement.
                </Td>
              </Tr>
              <Tr>
                <Td>No Guarantees</Td>
                <Td>Made accessible in a Subscription Publisher with no reuse rights.</Td>
                <Td>
                  Publishers sometimes make articles available for limited periods or without guarantees. This makes
                  more articles readable but doesn’t ensure long term accessibility.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>

        <Text textStyle="p">
          Table 3 provides a breakdown of the Other Platform Open categories, as shown in the charts on institution and
          country details pages.
        </Text>

        <ScrollTable caption="Table 3. Other Platform Open categories." mb="32px">
          <Table variant="content">
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Significance</Th>
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
                  Institutions can take responsibility for archiving their own materials, ensure their own awareness of
                  research outputs, and leverage institutional policies including rights retention approaches.
                </Td>
              </Tr>
              <Tr>
                <Td>Preprint</Td>
                <Td>
                  Publications deposited on servers that do not make claims about formal peer review. Generally non-peer
                  reviewed manuscripts, including working papers on platforms such as arXiv, bioRxiv, SSRN, RePec etc.
                </Td>
                <Td>
                  In many disciplines preprints or working papers are a major mode of dissemination. Using preprint
                  servers also enables post-release peer review and often offers an alternate route to increasing access
                  which is easier than for formally published versions.
                </Td>
              </Tr>
              <Tr>
                <Td>Domain</Td>
                <Td>
                  Publications from domain repositories, also known as disciplinary or subject repositories. A domain
                  repository contains publications from a specific subject area. Examples include PubMed Central, Europe
                  PMC and Econstor.
                </Td>
                <Td>
                  The large domain repositories with the roots in biomedical sciences, Pubmed Central and Europe PMC are
                  major drivers of access, often linked to their use within the policy requirements for funders that
                  were early movers on open access.
                </Td>
              </Tr>
              <Tr>
                <Td>Public</Td>
                <Td>
                  Publications from repositories that can be used by researchers from any domain and to deposit any form
                  of output, including pre-prints, published manuscripts and datasets. Semantic Scholar, Figshare and
                  Zenodo are a few examples.
                </Td>
                <Td>
                  Free and public repositories are an increasing medium for the release of research materials including
                  those beyond the traditional research paper. Where they are used specifically for providing access to
                  formally published (or intended to be published) materials they can be used to host both pre-peer
                  review manuscripts (“preprints”) or post review manuscripts.
                </Td>
              </Tr>
              <Tr>
                <Td>Other Internet</Td>
                <Td>
                  Outputs on sites we have not classified. In practice these are copies identified by CiteSeer X which
                  is in turn indexed by Unpaywall. It may include publications on academic staff pages, blogs and social
                  networks. We do not directly track outputs on platforms such as academia.edu and researchgate.net.
                </Td>
                <Td>
                  It is still common for outputs to be placed in many places. These sources are generally not archived
                  or reliable for the long term so we do not count them in the more reliable categories of platform.
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </ScrollTable>
      </Card>
    </Box>
  );
}
