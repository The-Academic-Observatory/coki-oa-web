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

import type { SystemStyleObject } from "@chakra-ui/theme-tools";

const margin = 24;

const numericStyles: SystemStyleObject = {
  "&[data-is-numeric=true]": {
    textAlign: "end",
  },
};

const Table = {
  variants: {
    dashboard: {
      table: {
        width: `calc(100% - ${margin * 2}px)`,
        maxWidth: `calc(100% - ${margin * 2}px)`,
        background: "white",
        margin: { base: "14px 0 0 0", md: `${margin}px` },
        thead: {
          th: {
            textStyle: "tableHeader",
            bgColor: "white",
            height: "50px",
            verticalAlign: "top",
            textAlign: "left",
            _first: {
              position: "sticky",
              left: 0,
            },
            ...numericStyles,
          },
        },
        tbody: {
          tr: {
            height: "52px",
            _even: {
              background: "#F9FAFA",
              td: {
                _first: {
                  background: { base: "#F9FAFA", md: "none" },
                },
              },
            },
            _odd: {
              background: "white",
              td: {
                _first: {
                  background: { base: "white", md: "none" },
                },
              },
            },
            _hover: {
              position: "relative",
              background: "white",
              boxShadow: "0px 2px 25px 10px rgba(0,0,0,0.1)",
              transform: "scale(1)", // CSS box shadow not showing on odd rows: https://stackoverflow.com/questions/55046056/css-box-shadow-on-table-row-not-displaying-correctly,
              td: {
                _first: {
                  background: { base: "white", md: "none" },
                },
              },
            },
            td: {
              textStyle: "tableCell",
              "z-index": 0,
              _first: {
                position: "sticky",
                left: 0,
              },
              ...numericStyles,
            },
          },
        },
      },
    },
  },
};

export default Table;
