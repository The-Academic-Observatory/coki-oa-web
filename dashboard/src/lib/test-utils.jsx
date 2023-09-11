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

// Overrides the @testing-library/react render function, so that it wraps components with the ChakraProvider and Fonts
// so that jest tests can test components that use the Chakra theme

import "../styles/globals.css";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import "../theme/styles.css";
import { Fonts } from "@/components/common";
import { render } from "@testing-library/react";

const Providers = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      {children}
    </ChakraProvider>
  );
};

const chakraRender = (ui, options) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";

export { chakraRender as render };
