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

interface ScrollTableProps extends BoxProps {
  children: ReactNode;
  caption?: string;
}

const ScrollTable = ({ children, caption, ...rest }: ScrollTableProps) => {
  let captionElement = <></>;
  if (caption) {
    captionElement = <Text textStyle="tableCaption">{caption}</Text>;
  }

  return (
    <Box {...rest} textAlign="center">
      {/* Note that 36px is subtracted as this is the padding added by the Card element */}
      <Box overflowX="auto" maxWidth="calc(100vw - 36px)">
        {children}
      </Box>
      {captionElement}
    </Box>
  );
};

export default ScrollTable;
