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

import React, { memo } from "react";
import IcoMoon from "react-icomoon";
import { Box, BoxProps } from "@chakra-ui/react";

const iconSet = require("./selection.json");

interface IconProps extends BoxProps {
  icon: string;
  size: number;
}

const Icon = ({ icon, size, ...rest }: IconProps) => {
  const pixelSize = size / 4;

  return (
    <Box width={pixelSize} height={pixelSize} {...rest}>
      <IcoMoon iconSet={iconSet} icon={icon} size={size} />
    </Box>
  );
};

export default memo(Icon);
