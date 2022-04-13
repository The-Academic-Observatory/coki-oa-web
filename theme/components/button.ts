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
        fontWeight: 600,
        fontSize: "10px",
        lineHeight: "12px",
        textTransform: "uppercase",
      },
      span: {
        lineHeight: "12px",
        ml: "0px",
        width: "12px",
      },
      borderRadius: "25px",
      height: "24px",
      paddingLeft: "8px",
      paddingRight: "8px",
      _hover: {
        bgColor: "brand.600",
        cursor: "pointer",
      },
      _focus: {
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
    pureIconButton: {
      width: "32px",
      height: "32px",
      minWidth: "32px",
      maxWidth: "32px",
      maxHeight: "32px",
      color: "grey.700",
      svg: {
        width: "12px",
        height: "12px",
        transform: "scale(3)",
      },
      _focus: {
        boxShadow: "none",
      },
      _hover: {
        color: "brand.500",
      },
    },
  },
};

export default Button;
