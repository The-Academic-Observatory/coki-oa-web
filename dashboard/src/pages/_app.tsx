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

import { Fonts } from "@/components/common";
import { Layout } from "@/layouts";
import "@/styles/globals.css";
import "@/theme/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import React from "react";
import theme from "../theme";

function OpenAccessWebApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      {process.env.COKI_ENVIRONMENT === "production" && (
        <Script data-domain="open.coki.ac" src="/js/script.js" strategy="lazyOnload" />
      )}
      <Fonts />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default OpenAccessWebApp;
