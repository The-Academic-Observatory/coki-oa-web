// Copyright (c) NiklasMencke
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Source: https://github.com/NiklasMencke/nextjs-breadcrumbs

import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  BreadcrumbLink as ChakraBreadcrumbLink,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Takes an URL String and removes query params and hash params
 *
 * @param url - The URL string
 * @returns The transformed URL string
 *
 */
const getPathFromUrl = (url: string): string => {
  return url.split(/[?#]/)[0];
};

/**
 * Takes a breadcrumb title (from url path) and replaces
 * special chars to more readable chars
 *
 * @param title - The breadcrumb title
 * @returns The transformed title or the result of the custom transformLabel function
 *
 */
const convertBreadcrumb = (
  title: string,
  toUpperCase: boolean | undefined,
  replaceCharacterList: Array<CharacterMap> | undefined,
  transformLabel?: ((title: string) => React.ReactNode) | undefined
): React.ReactNode => {
  let transformedTitle = getPathFromUrl(title);

  if (transformLabel) {
    return transformLabel(transformedTitle);
  }

  if (replaceCharacterList) {
    for (let i = 0; i < replaceCharacterList.length; i++) {
      transformedTitle = transformedTitle.replaceAll(
        replaceCharacterList[i].from,
        replaceCharacterList[i].to
      );
    }
  }

  // decode for utf-8 characters and return ascii.
  return toUpperCase
    ? decodeURI(transformedTitle).toUpperCase()
    : decodeURI(transformedTitle);
};

export interface Breadcrumb {
  /** Breadcrumb title. Example: 'blog-entries' */
  breadcrumb: string;

  /** The URL which the breadcrumb points to. Example: 'blog/blog-entries' */
  href: string;
}

export interface CharacterMap {
  /** The source character or character pattern that should be replaced (e.g. 'ae') */
  from: string;

  /** The replacement into which the character should be replaced. */
  to: string;
}

export interface BreadcrumbsProps {
  /** If true, the default styles are used.
   * Make sure to import the CSS in _app.js
   * Example: true Default: false */
  useDefaultStyle?: boolean;

  /** The title for the very first breadcrumb pointing to the root directory. Example: '/' Default: 'HOME' */
  rootLabel?: string | null;

  /** Boolean indicator whether the root label should be omitted. Example: true Default: false */
  omitRootLabel?: boolean;

  /** Boolean indicator if the labels should be displayed as uppercase. Example: true Default: false */
  labelsToUppercase?: boolean | undefined;

  /** Array containing a list of specific characters that should be replaced in the label. This can be useful to convert special characters such as vowels. Example: [{ from: 'ae', to: 'ä' }, { from: '-', to: ' '}] Default: [{ from: '-', to: ' ' }] */
  replaceCharacterList?: Array<CharacterMap> | undefined;

  /** A transformation function that allows to customize the label strings. Receives the label string and has to return a string or React Component */
  transformLabel?: ((title: string) => React.ReactNode) | undefined;

  /** Array containing all the indexes of the path that should be omitted and not be rendered as labels. If we have a path like '/home/category/1' then you might want to pass '[2]' here, which omits the breadcrumb label '1'. Indexes start with 0. Example: [2] Default: undefined */
  omitIndexList?: Array<number> | undefined;

  /** An inline style object for the outer container */
  containerStyle?: any | null;

  /** Classes to be used for the outer container. Won't be used if useDefaultStyle is true */
  containerClassName?: string;

  /** An inline style object for the breadcrumb list */
  listStyle?: any | null;

  /** Classes to be used for the breadcrumb list */
  listClassName?: string;

  /** An inline style object for the inactive breadcrumb list item */
  inactiveItemStyle?: any | null;

  /** Classes to be used for the inactive breadcrumb list item */
  inactiveItemClassName?: string;

  /** An inline style object for the active breadcrumb list item */
  activeItemStyle?: any | null;

  /** Classes to be used for the active breadcrumb list item */
  activeItemClassName?: string;
}

const defaultProps: BreadcrumbsProps = {
  useDefaultStyle: false,
  rootLabel: "Home",
  omitRootLabel: false,
  labelsToUppercase: false,
  replaceCharacterList: [{ from: "-", to: " " }],
  transformLabel: undefined,
  omitIndexList: undefined,
  containerStyle: null,
  containerClassName: "",
  listStyle: null,
  listClassName: "",
  inactiveItemStyle: null,
  inactiveItemClassName: "",
  activeItemStyle: null,
  activeItemClassName: "",
};

const Breadcrumbs = ({
  useDefaultStyle,
  rootLabel,
  omitRootLabel,
  labelsToUppercase,
  replaceCharacterList,
  transformLabel,
  omitIndexList,
  containerStyle,
  containerClassName,
  listStyle,
  listClassName,
  inactiveItemStyle,
  inactiveItemClassName,
  activeItemStyle,
  activeItemClassName,
  ...rest
}: BreadcrumbsProps) => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<Breadcrumb> | null>(
    null
  );

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <ChakraBreadcrumb variant="dashboard" {...rest}>
      {!omitRootLabel && (
        <ChakraBreadcrumbItem>
          <ChakraBreadcrumbLink as={Link} href="/">
            {convertBreadcrumb(
              rootLabel || "Home",
              labelsToUppercase,
              replaceCharacterList,
              transformLabel
            )}
          </ChakraBreadcrumbLink>
        </ChakraBreadcrumbItem>
      )}
      {breadcrumbs.length >= 1 &&
        breadcrumbs.map((breadcrumb, i) => {
          if (
            !breadcrumb ||
            breadcrumb.breadcrumb.length === 0 ||
            (omitIndexList && omitIndexList.find((value) => value === i))
          ) {
            return;
          }
          return (
            <ChakraBreadcrumbItem key={breadcrumb.href}>
              <ChakraBreadcrumbLink as={Link} href={breadcrumb.href}>
                {convertBreadcrumb(
                  breadcrumb.breadcrumb,
                  labelsToUppercase,
                  replaceCharacterList,
                  transformLabel
                )}
              </ChakraBreadcrumbLink>
            </ChakraBreadcrumbItem>
          );
        })}
    </ChakraBreadcrumb>
  );
};

export default Breadcrumbs;
