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

const Button = {
  variants: {
    clean: {
      size: "lg",
      _focus: { boxShadow: "none" },
      _active: {
        bg: "rgba(236, 236, 236, 0.3)",
        boxShadow: "none",
      },
    },
    table: {
      bgColor: "brand.500",
      color: "white",
      transitionProperty: "common",
      transitionDuration: "normal",
      p: {
        fontWeight: 500,
        fontSize: "9px",
        textTransform: "uppercase",
      },
      span: {
        ml: 0,
        width: "12px",
      },
      borderRadius: "20px",
      height: "20px",
      paddingX: "8px",
      _hover: {
        bgColor: "brand.600",
        cursor: "pointer",
      },
      _focus: {
        boxShadow: "none",
      },
    },
    tabButton: {
      bgColor: "brand.500",
      color: "white",
      transitionProperty: "common",
      transitionDuration: "normal",
      fontWeight: 900,
      fontSize: "16px",
      textTransform: "uppercase",
      borderRadius: 0,
      height: "60px",
      p: { base: "12px 12px", sm: "8px 32px" },
      _hover: {
        bgColor: "brand.600",
        _disabled: {
          bg: "brand.500",
        },
      },
      _focus: {
        boxShadow: "none",
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
        boxShadow: "none",
      },
    },
    dashboard: {
      bgColor: "brand.500",
      color: "white",
      transitionProperty: "common",
      transitionDuration: "normal",
      textTransform: "uppercase",
      fontSize: "16px",
      fontWeight: 500,
      borderRadius: "30px",
      height: "40px",
      px: "24px",
      _hover: {
        bgColor: "brand.600",
        _disabled: {
          bg: "brand.500",
        },
      },
      _focus: {
        boxShadow: "none",
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
        boxShadow: "none",
      },
    },
    pageIconButton: {
      width: "32px",
      height: "32px",
      minWidth: "32px",
      maxWidth: "32px",
      maxHeight: "32px",
      color: "grey.700",
      svg: {
        width: "22px",
        height: "22px",
      },
      _focus: {
        boxShadow: "none",
      },
      _hover: {
        color: "brand.500",
      },
    },
    filterForm: {
      bgColor: "brand.500",
      color: "white",
      transitionProperty: "common",
      transitionDuration: "normal",
      p: {
        fontWeight: 500,
        fontSize: { base: "16px", md: "12px" },
        lineHeight: "12px",
        textTransform: "uppercase",
      },
      span: {
        lineHeight: "12px",
        ml: "0px",
        width: "12px",
      },
      borderRadius: "25px",
      height: { base: "36px", md: "26px" },
      px: { base: "24px", md: "16px" },
      _hover: {
        bgColor: "brand.600",
        _disabled: {
          bg: "brand.500",
        },
      },
      _focus: {
        boxShadow: "none",
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
        boxShadow: "none",
      },
    },
    buttonLink: {
      px: 0,
      mx: 0,
      minWidth: "20px",
      fontWeight: 500,
      _focus: { boxShadow: "none" },
      _active: {
        bg: "none",
        boxShadow: "none",
      },
      span: {
        ml: "2px",
      },
    },
    buttonLinkSelected: {
      px: 0,
      mx: 0,
      minWidth: "20px",
      fontWeight: 500,
      color: "brand.500",
      textDecoration: "underline",
      _focus: { boxShadow: "none" },
      _active: {
        bg: "none",
        boxShadow: "none",
      },
      span: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ml: "2px",
      },
    },
  },
};

export default Button;
