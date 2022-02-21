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

import {
  Box,
  BoxProps,
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  BreadcrumbLink as ChakraBreadcrumbLink,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export interface Breadcrumb {
  title: string;
  href: string;
}

export interface BreadcrumbsProps extends BoxProps {
  breadcrumbs: Array<Breadcrumb>;
}

const Breadcrumbs = ({ breadcrumbs, ...rest }: BreadcrumbsProps) => {
  // Add root label
  breadcrumbs = [
    {
      title: "Home",
      href: "/",
    },
  ].concat(breadcrumbs);

  return (
    <Box display={{ base: "none", md: "block" }} pb="32px" {...rest}>
      <ChakraBreadcrumb {...rest}>
        {breadcrumbs.map((breadcrumb, i) => {
          return (
            <ChakraBreadcrumbItem key={i}>
              <ChakraBreadcrumbLink as={Link} href={breadcrumb.href}>
                {breadcrumb.title.toUpperCase()}
              </ChakraBreadcrumbLink>
            </ChakraBreadcrumbItem>
          );
        })}
      </ChakraBreadcrumb>
    </Box>
  );
};

export default Breadcrumbs;
