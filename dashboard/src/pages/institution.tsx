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

import { Dashboard, getDashboardStaticProps } from "@/components/dashboard";
import React from "react";
import { DashboardPageProps } from "./index";

const InstitutionIndexPage = ({ defaultCountries, defaultInstitutions, stats }: DashboardPageProps) => {
  return (
    <Dashboard
      defaultEntityType="institution"
      defaultCountries={defaultCountries}
      defaultInstitutions={defaultInstitutions}
      stats={stats}
    />
  );
};

export async function getStaticProps() {
  return getDashboardStaticProps();
}

export default InstitutionIndexPage;