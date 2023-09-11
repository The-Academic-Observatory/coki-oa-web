// Copyright 2023 Curtin University
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
import Card from "../components/common/Card";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Head from "../components/common/Head";
import licensesDashboardJSON from "../../data/licenses-dashboard.json";
import licensesWorkersApiJSON from "../../data/licenses-workers-api.json";
import licensesWorkersImagesJSON from "../../data/licenses-workers-images.json";

export type LicensesPageProps = {
  licensesDashboard: Array<License>;
  licensesWorkersApi: Array<License>;
  licensesWorkersImages: Array<License>;
};

interface LicenseListProps {
  licenses: License[];
}

const LicenseList: React.FC<LicenseListProps> = ({ licenses }) => {
  return (
    <>
      {licenses.map((license: License) => (
        <Box key={license.packageName}>
          <Text as="p" textStyle="p" fontWeight={500} pb="6px" fontSize="20px" lineHeight="22px">
            {license.packageName}
          </Text>
          <Text as="p" textStyle="p" pb="6px" fontSize="20px" lineHeight="22px">
            License: {license.licenses}
          </Text>
          <Text as="p" textStyle="p" pb="6px" fontSize="20px" lineHeight="22px">
            Copyright: {license.copyright}
          </Text>
          <Text as="p" textStyle="p" pb="6px" fontSize="20px" lineHeight="22px">
            Repository:{" "}
            <a href={license.repository} target="_blank" rel="noreferrer">
              {license.repository}
            </a>
          </Text>
          <Text as="p" textStyle="p" fontSize="16px" lineHeight="18px">
            {license.licenseText}
          </Text>
        </Box>
      ))}
    </>
  );
};

export default function Licenses({ licensesDashboard, licensesWorkersApi, licensesWorkersImages }: LicensesPageProps) {
  const title = "COKI: Open Source Licenses";
  const description = "COKI Open Access Dashboard Open Source Third Party License Notices.";

  return (
    <Box layerStyle="page">
      {/* This component contains the Head tag for the page. */}
      <Head title={title} description={description} />

      <Breadcrumbs
        breadcrumbs={[
          {
            title: "Licenses",
            href: "/licenses/",
          },
        ]}
      />

      <Card>
        <Text as="h1" textStyle="h1">
          Third Party Licenses
        </Text>

        <Text as="p" textStyle="p">
          This page provides the required notices and licenses for the third-party software packages used in this web
          application.
        </Text>

        <Text as="h3" textStyle="h2">
          Dashboard
        </Text>

        <LicenseList licenses={licensesDashboard} />

        <Text as="h3" textStyle="h2">
          Data REST API
        </Text>

        <LicenseList licenses={licensesWorkersApi} />

        <Text as="h3" textStyle="h2">
          Images REST API
        </Text>

        <LicenseList licenses={licensesWorkersImages} />
      </Card>
    </Box>
  );
}

type LicenseInfo = {
  licenses: string;
  repository: string;
  copyright: string;
  licenseText: string;
};

type LicensesData = {
  [packageName: string]: LicenseInfo;
};

type License = {
  packageName: string;
  licenses: string;
  copyright: string;
  repository: string;
  licenseText: string;
};

const getLicenseInfo = (licensesData: LicensesData) => {
  const licenses = [];
  for (const [packageName, licenseInfo] of Object.entries(licensesData)) {
    const license = {
      packageName: packageName,
      licenses: licenseInfo.licenses,
      copyright: licenseInfo.copyright,
      repository: licenseInfo.repository,
      licenseText: licenseInfo.licenseText,
    };
    licenses.push(license);
  }

  return licenses;
};

export async function getStaticProps() {
  return {
    props: {
      licensesDashboard: getLicenseInfo(licensesDashboardJSON as LicensesData),
      licensesWorkersApi: getLicenseInfo(licensesWorkersApiJSON as LicensesData),
      licensesWorkersImages: getLicenseInfo(licensesWorkersImagesJSON as LicensesData),
    },
  };
}
