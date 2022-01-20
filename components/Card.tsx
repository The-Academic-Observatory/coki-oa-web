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
  bgBase: string;
  pBase: string;
}

const Card = ({ children, bgBase, pBase, ...rest }: CardProps) => {
  return (
    <Box
      bg={{ base: bgBase, md: "white" }}
      boxShadow={{ base: "none", md: "md" }}
      rounded={"md"}
      overflow={"hidden"}
      maxWidth="1326px"
      p={{ base: pBase, md: "48px" }}
      {...rest}
    >
      {children}
    </Box>
  );
};

Card.defaultProps = {
  bgBase: "white",
  pBase: "24px",
};

export default Card;
