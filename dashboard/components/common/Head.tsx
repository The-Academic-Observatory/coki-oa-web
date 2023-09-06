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

import { memo, ReactNode } from "react";
import NextHead from "next/head";
import { useRouter } from "next/router";

export interface HeadProps {
  children?: ReactNode;
  title: string;
  description: string;
  shareTitle?: string;
  shareDescription?: string;
  shareImage?: string;
  shareImageWidth?: string;
  shareImageHeight?: string;
  shareImageType?: string;
}

const Head = ({
  children,
  title,
  description,
  shareTitle,
  shareDescription,
  shareImage,
  shareImageWidth,
  shareImageHeight,
  shareImageType,
}: HeadProps) => {
  if (shareTitle === undefined) {
    shareTitle = title;
  }

  if (shareDescription === undefined) {
    shareDescription = description;
  }

  if (shareImage === undefined) {
    shareImage = `${process.env.COKI_SITE_URL}/logo-social-card.png`;
  }

  if (shareImageWidth === undefined) {
    shareImageWidth = "1200";
  }

  if (shareImageHeight === undefined) {
    shareImageHeight = "628";
  }

  if (shareImageType === undefined) {
    shareImageType = "image/png";
  }

  const pageUrl = `${process.env.COKI_SITE_URL}${useRouter().asPath}`;

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
      <meta property="og:image:type" content={shareImageType} />
      {/* Use width and height tags so that Facebook crawler can render card straight away: https://developers.facebook.com/docs/sharing/webmasters/images/ */}
      <meta property="og:image:width" content={shareImageWidth} />
      <meta property="og:image:height" content={shareImageHeight} />
      <meta property="og:url" content={pageUrl} />

      {children}
    </NextHead>
  );
};

export default memo(Head);
