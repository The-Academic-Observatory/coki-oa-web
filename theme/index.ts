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
  extendTheme,
  theme as base,
  withDefaultColorScheme,
  withDefaultVariant,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import Table from "./components/table";
import Button from "./components/button";
import Tabs from "./components/tabs";

const breakpoints = createBreakpoints({
  sm: "600px",
  md: "935px",
  lg: "1600px",
  xl: "1920px",
  "2xl": "3840px",
});

const theme = extendTheme(
  {
    breakpoints: breakpoints,
    colors: {
      brand: {
        100: "#FFECD1",
        200: "#FFD3A4",
        300: "#FFB38E", // FFB576
        400: "#FF9754",
        500: "#FF671C", // buttons
        600: "#D25A1F", // DB4914
        700: "#B7300E",
        800: "#931B08",
        900: "#7A0D05",
      },
      grey: {
        100: "#FFFFFF", // header
        200: "#FAFAFA", // contents background
        300: "#F7F7F7", // content top of dashboard bg / alternating row / mobile footer
        400: "#F2F2F2", // sidebar,
        500: "#EBEBEB", // tab not selected
        600: "#DFDFDF", //
        700: "#BFBFBF",
        800: "#A6A6A6", // deselected tab header text
        900: "#101820", // desktop footer
      },
    },
    fonts: {
      heading: "brandon-grotesque",
      body: "brandon-grotesque",
    },
    textStyles: {
      homeHeader: {
        // Bold
        fontWeight: 700,
        fontSize: "24px",
        color: "brand.500",
        textTransform: "uppercase",
      },
      h1: {
        // Black
        fontWeight: 900,
        fontSize: { base: "26px", md: "44px" },
        color: "brand.500",
        textTransform: "uppercase",
        mb: { base: "18px", md: "32px" },
      },
      h2: {
        // Black
        fontWeight: 900,
        fontSize: { base: "21px", md: "26px" },
        color: "brand.500",
        textTransform: "uppercase",
        mb: "12px",
      },
      p: {
        // Light
        fontWeight: 300,
        fontSize: "21px",
        lineHeight: "36px",
        mb: "16px",
      },
      li: {
        // Light
        fontWeight: 300,
        fontSize: "21px",
        lineHeight: "28px",
        mb: "16px",
      },
      menuItem: {
        // Bold, Medium
        fontWeight: { base: 700, md: 500 },
        fontSize: { base: "24px", md: "16px" },
        textTransform: "uppercase",
      },
      footerLink1: {
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "uppercase",
      },
      footerLink2: {
        fontSize: "14px",
        fontWeight: 500,
      },
      breadcrumb: {
        fontWeight: 500,
        fontSize: "15px",
      },
      tabHeader: {
        fontWeight: 900,
        fontSize: "16px",
        textTransform: "uppercase",
      },
      tableHeader: {
        fontWeight: 900,
        fontSize: "14px",
        textTransform: "uppercase",
      },
      tableSubHeader: {
        fontWeight: 400,
        fontSize: "10px",
        lineHeight: "12px",
        textTransform: "uppercase",
        color: "grey.900",
      },
      tableCell: {
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "uppercase",
      },
      entityHeading: {
        fontWeight: 900,
        fontSize: { base: "26px", md: "44px" },
        textTransform: "uppercase",
        color: "brand.500",
      },
      entityIconLink: {
        fontWeight: 900,
        fontSize: { base: "9px", md: "16px" },
        textTransform: "uppercase",
      },
      entityID: {
        fontWeight: 500,
        fontSize: { base: "9px", md: "14px" },
        whiteSpace: "nowrap",
        display: "inline",
        // lineHeight: {base: '1px', md: '14px'},
      },
      entityBold: {
        fontWeight: 900,
        fontSize: { base: "9px", md: "14px" },
        whiteSpace: "nowrap",
        display: "inline",
        // lineHeight: {base: '1px', md: '14px'},
      },
      entityOAScoreHeading: {
        fontWeight: 900,
        fontSize: { base: "14px", md: "14px" },
        lineHeight: { base: "14px", md: "14px" },
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      },
      entityOAScoreValue: {
        fontWeight: 900,
        fontSize: { base: "50px", md: "40px" },
        lineHeight: { base: "50px", md: "40px" },
      },
      entityStatsHeading: {
        fontWeight: 900,
        fontSize: { base: "11px", md: "14px" },
        lineHeight: { base: "11px", md: "14px" },
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      },
      entityStatsValue: {
        fontWeight: 900,
        fontSize: { base: "26px", md: "32px" },
        lineHeight: { base: "26px", md: "32px" },
      },
      entityCardHeading: {
        fontWeight: 900,
        fontSize: { base: "18px", md: "28px" },
        color: "brand.500",
        textTransform: "uppercase",
      },
      breakdownHeading: {
        fontWeight: 900,
        fontSize: { base: "9px", md: "17px" },
        lineHeight: { base: "9px", md: "17px" },
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        pt: { base: "6px", md: "12px" },
        pb: { base: "3px", md: "6px" },
      },
      breakdownValue: {
        fontWeight: 900,
        fontSize: { base: "25px", md: "46px" },
        lineHeight: { base: "25px", md: "46px" },
      },
      chartKeyHeader: {
        fontWeight: 900,
        textTransform: "uppercase",
        fontSize: "18px",
        whiteSpace: "nowrap",
      },
      chartKeyDescription: {
        fontSize: "14px",
        height: "24px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      lastUpdated: {
        fontWeight: 500,
        textTransform: "uppercase",
        fontSize: "9px",
      },
    },
    layerStyles: {
      pGap: {
        mb: { base: "48px", md: "96px" },
      },
      logo: {
        minWidth: { base: "100px", sm: "200px" },
        p: "20px",
      },
      chartKeys: {
        ml: { base: 0, md: "16px" },
        mt: { base: "12px", md: 0 },
      },
      chartKeyRow: {
        // borderTop: "2px solid #EBEBEB",
        // borderBottom: "2px solid #EBEBEB",
        alignItems: "center",
        paddingTop: "6px",
        paddingBottom: "6px",
      },
      chartKeyBox: {
        minWidth: "12px",
        width: "12px",
        height: "12px",
        mr: "6px",
      },
      pageButton: {
        width: "32px",
        height: "32px",
        alignItems: "center",
        // align: "center",
        justifyContent: "center",
        div: {
          minWidth: "12px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "grey.500",
        },
        _hover: {
          cursor: "pointer",
          div: {
            backgroundColor: "brand.500",
          },
        },
        mx: "2px",
      },
    },
    components: {
      Table,
      Button,
      Tabs,
    },
  },

  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Button"],
  }),
  withDefaultVariant({
    variant: "filled",
    components: ["Input", "Select"],
  })
);

export default theme;