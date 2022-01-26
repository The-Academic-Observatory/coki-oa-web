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

import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode } from "react";

interface LinkLinkProps extends LinkProps {
  href: string;
  children: ReactNode;
}

const Link = ({ href, children, ...rest }: LinkLinkProps) => {
  return (
    <NextLink href={href} passHref>
      {/*The empty focus stops the ugly blue border from appearing on focus*/}
      <ChakraLink {...rest} _focus={{}}>
        {children}
      </ChakraLink>
    </NextLink>
  );
};

export default Link;
