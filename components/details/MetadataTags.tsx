import { memo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export interface MetadataShareTagsProps {
  title: string;
  description: string;
  shareTitle?: string;
  shareDescription?: string;
  shareImage?: string;
  type?: string;
}

const MetadataTags = ({
  title,
  description,
  shareTitle,
  shareDescription,
  shareImage,
  type,
}: MetadataShareTagsProps) => {
  if (shareTitle === undefined) {
    shareTitle = title;
  }

  if (shareDescription === undefined) {
    shareDescription = description;
  }

  if (shareImage === undefined) {
    shareImage = `${process.env.NEXT_PUBLIC_HOST}/logo-sharecard.jpg`;
  }

  if (type === undefined) {
    type = "website";
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_HOST}${useRouter().asPath}`;

  // Next needs parts of all the page Head in one place for the meta tags to appear properly.
  // PageUrl route needs to come from outside this function.
  return (
    <Head>
      {/* Page Details */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Metadata for Twitter sharing */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@COKIproject" />
      <meta name="twitter:title" content={shareTitle} />
      <meta name="twitter:description" content={shareDescription} />
      <meta name="twitter:image" content={shareImage} />
      <meta name="twitter:image:alt" content={shareDescription} />

      {/* Metadata for sharing to other social sites*/}
      <meta property="og:title" content={shareTitle} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:type" content={type} />
      <meta property="og:description" content={shareDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image:alt" content={`${process.env.NEXT_PUBLIC_HOST}/logo-sharecard.jpg`} />
    </Head>
  );
};

export default memo(MetadataTags);
