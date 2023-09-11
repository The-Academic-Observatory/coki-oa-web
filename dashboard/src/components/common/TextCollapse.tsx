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

import { Box, BoxProps, Collapse, Text, useDisclosure } from "@chakra-ui/react";
import React, { memo, ReactElement } from "react";

interface TextCollapseProps extends BoxProps {
  previewText: string | ReactElement;
  text: string | ReactElement;
  showCollapse?: boolean;
}

const TextCollapse = ({ previewText, text, showCollapse = true, ...rest }: TextCollapseProps) => {
  const [actionText, setActionText] = React.useState<string>("Read More");
  const { isOpen, onToggle } = useDisclosure();

  let link = <></>;
  if (showCollapse) {
    link = (
      <>
        <a
          onClick={() => {
            if (isOpen) {
              setActionText("Read More");
            } else {
              setActionText("Read Less");
            }
            onToggle();
          }}
        >
          {actionText}.
        </a>
      </>
    );
  }

  return (
    <Box {...rest}>
      <Text textStyle="pNoGap">
        {previewText} {link}
      </Text>
      <Collapse in={isOpen} animateOpacity>
        <Text pt="8px" textStyle="pNoGap">
          {text}
        </Text>
      </Collapse>
    </Box>
  );
};

export default memo(TextCollapse);
