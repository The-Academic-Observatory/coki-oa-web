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
// Author: Alex Massen-Hane

import { memo } from "react";
import NextHead from "next/head";
import { useRouter } from "next/router";

export interface HeadProps {
  title: string;
  description: string;
  shareTitle?: string;
  shareDescription?: string;
  shareImage?: string;
}

const Head = ({ title, description, shareTitle, shareDescription, shareImage }: HeadProps) => {
  if (shareTitle === undefined) {
    shareTitle = title;
  }

  if (shareDescription === undefined) {
    shareDescription = description;
  }

  if (shareImage === undefined) {
    shareImage = `${process.env.NEXT_PUBLIC_HOST}/logo-social-card.jpg`;
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_HOST}${useRouter().asPath}`;

  // Next needs parts of all the page Head in one place for the meta tags to appear properly.
  return (
    <NextHead>
      {/* Page Details */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Metadata for Twitter sharing */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@COKIproject" />
      <meta name="twitter:creator" content="@COKIproject" />
      <meta name="twitter:title" content={shareTitle} />
      <meta name="twitter:description" content={shareDescription} />
      <meta name="twitter:image" content={shareImage} />
      <meta name="twitter:image:alt" content={shareDescription} />

      {/* Metadata for sharing to other social sites */}
      <meta property="og:title" content={shareTitle} />
      <meta property="og:description" content={shareDescription} />
      <meta property="og:site_name" content="COKI Open Access Dashboard" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={shareImage} />
      <meta property="og:image:alt" content={shareDescription} />
      <meta property="og:url" content={pageUrl} />
    </NextHead>
  );
};

export default memo(Head);
