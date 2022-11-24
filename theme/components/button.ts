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

const solidStyle = {
  bgColor: "brand.500",
  color: "white",
  textTransform: "uppercase",
  _hover: {
    bgColor: "brand.600",
    _disabled: {
      bg: "brand.500",
    },
    textDecoration: "underline",
  },
  _active: {
    bgColor: "brand.700",
  },
  _focus: {
    boxShadow: "none",
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

const iconStyle = {
  _focus: { boxShadow: "none" },
  _active: {
    bg: "rgba(236, 236, 236, 0.3)",
    boxShadow: "none",
  },
};

const Button = {
  baseStyle: {
    fontWeight: 500,
    borderRadius: "full",

    // Not sure if the transition properties are doing anything
    transitionProperty: "common",
    transitionDuration: "normal",
  },
  sizes: {
    // Index table learn more buttons
    xs: {
      height: "20px",
      paddingX: "8px",
      fontSize: "9px",
      span: {
        mx: 0,
        height: "16px",
        width: "12px",
        svg: {
          height: "16px",
          width: "16px",
        },
      },
    },

    // Filter apply and clear buttons
    sm: {
      height: "26px",
      px: "16px",
      fontSize: "12px",
      lineHeight: "12px",
    },

    // Filter apply and clear on mobile
    md: {
      height: "36px",
      px: "24px",
      fontSize: "16px",
    },

    // Return to dashboard
    lg: {
      fontSize: "14px",
      lineHeight: "14px",
      height: "40px",
    },

    // Share, subregion, region, country and institution type tags
    tag: {
      height: "28px",
    },
  },
  defaultProps: {},

  variants: {
    // Default button
    solid: {
      ...solidStyle,
    },

    // Button with orange border and white fill
    outline: {
      bgColor: "white",
      color: "brand.500",
      border: "1px",
      borderColor: "brand.500",
      px: "8px", // Keeps text from overlapping edges
      _hover: {
        color: "white",
        bgColor: "brand.500",
        _disabled: {
          bg: "brand.500",
        },
      },
      _active: {
        color: "white",
        bgColor: "brand.600",
        borderColor: "brand.700",
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

    // Clean icon button used in nav bar
    icon: {
      ...iconStyle,
      width: "40px",
      height: "40px",
    },

    // Icon button with text
    iconText: {
      ...iconStyle,
      _hover: {
        textDecoration: "underline",
        cursor: "pointer",
      },
      width: "70px",
      height: "60px",
      borderRadius: "2px",
    },

    // Tab filter button
    filterTab: {
      ...solidStyle,
      fontWeight: 900,
      fontSize: "16px",
      borderRadius: 0,
      height: "60px",
      p: { base: "12px 12px", sm: "8px 32px" },
    },

    // Share button
    share: {
      ...solidStyle,
      textTransform: "none",
      pl: "12px",
      pr: "14px",
      width: "full",
      height: {
        base: "36px",
        md: "28px",
      },
      span: {
        m: 0,
        mr: { base: 0, sm: "6px" },
        height: "20px",
        width: "20px",
        svg: {
          height: "20px",
          width: "20px",
        },
      },
    },

    //  Page buttons
    pagination: {
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

    // Submit: apply and clear buttons
    submit: {
      ...solidStyle,
      height: { base: "36px", md: "26px" },
      px: { base: "24px", md: "16px" },
      fontSize: { base: "16px", md: "12px" },
      lineHeight: "12px",
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
