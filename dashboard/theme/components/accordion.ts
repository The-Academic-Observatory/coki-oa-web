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
// Author: Alex Massen-Hane, Aniek Roelofs, James Diprose

const paddingLeft = "24px";

const Accordion = {
  variants: {
    filterForm: {
      button: {
        height: { base: "60px", md: "48px" },
        bgColor: "white",
        _hover: {
          boxShadow: "none",
          bg: "brand.500",
          color: "white",
        },
        _focus: {
          boxShadow: "none",
        },
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderColor: "grey.500",
        pl: paddingLeft,
        textAlign: "left",
        fontWeight: 700,
        fontSize: { base: "18px", md: "12px" },
        textTransform: "uppercase",
      },
      container: {
        borderTopWidth: 0,
        borderBottomWidth: "0 !important",
      },
      panel: {
        bgColor: "#F8F8F8",
        borderBottomWidth: "1px",
        borderColor: "grey.500",
        p: 0,
      },
    },
    checkboxTree: {
      button: {
        p: 0,
        my: "6px",
        bgColor: "grey.300",
        _hover: {
          boxShadow: "none",
          bg: "grey.300",
          color: "black",
        },
        _focus: {
          boxShadow: "none",
        },
      },
      container: {
        border: "none",
        borderTopWidth: "none",
        borderBottomWidth: "none",
        borderColor: "none",
        p: 0,
      },
      panel: {
        border: "none",
        borderBottomWidth: "none",
        borderColor: "none",
        pl: "14px",
        pb: "8px",
        pr: 0,
        pt: 0,
      },
    },
  },
};

export default Accordion;
