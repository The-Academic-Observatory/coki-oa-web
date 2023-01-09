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

import React, { ReactNode } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  children: ReactNode;
  bgBase?: string;
  pBase?: string;
}

const Card = ({ children, bgBase = "white", pBase = "24px", ...rest }: CardProps) => {
  return (
    <Box
      bg={{ base: bgBase, md: "white" }}
      boxShadow={{ base: "none", md: "md" }}
      rounded={"md"}
      overflow={"hidden"}
      // maxWidth={{ base: "100%", md: "900px", std: "970px" }}
      py={{ base: "32px", sm: "32px", md: "48px" }}
      px={{ base: "18px", sm: "18px", md: "48px" }}
      pb={{ base: "96px", sm: "96px", md: "48px" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Card;
