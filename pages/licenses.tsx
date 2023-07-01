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
import webAppLicensesJson from "../licenses.json";
import apiLicensesJson from "../workers-api/licenses.json";

export type LicensesPageProps = {
  webAppLicenses: Array<License>;
  apiLicenses: Array<License>;
};

export default function Licenses({ webAppLicenses, apiLicenses }: LicensesPageProps) {
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
          COKI Open Access Dashboard
        </Text>

        {webAppLicenses.map((license: License) => (
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

        <Text as="h3" textStyle="h2">
          COKI Open Access REST API
        </Text>

        {apiLicenses.map((license: License) => (
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
  const webAppLicensesData = webAppLicensesJson as LicensesData;
  const apiLicensesData = apiLicensesJson as LicensesData;
  const webAppLicenses = getLicenseInfo(webAppLicensesData);
  const apiLicenses = getLicenseInfo(apiLicensesData);

  return {
    props: {
      webAppLicenses: webAppLicenses,
      apiLicenses: apiLicenses,
    },
  };
}
