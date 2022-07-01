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
import { Box, BoxProps, Text } from "@chakra-ui/react";

interface FigureProps extends BoxProps {
  children: ReactNode;
  caption: string;
}

const Figure = ({ children, caption, ...rest }: FigureProps) => {
  let captionElement = <></>;
  if (caption) {
    captionElement = <Text textStyle="caption">{caption}</Text>;
  }

  return (
    // @ts-ignore: TODO: align="center" not valid anymore?
    <Box w="full" align="center" py="32px">
      <Box {...rest}>
        {children}
        {captionElement}
      </Box>
    </Box>
  );
};

Figure.defaultProps = {
  caption: null,
};

export default Figure;
