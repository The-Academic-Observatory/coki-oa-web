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

const Popover = {

  variants: {
    shareButton: {
      content: {
        _focus: {  
          boxShadow: "white.500"
        },
        width: "min-content",
        height: "min-content",
        mr: { base: "10px",  sm: "10px", md: "49px", std: "49px"},
        style: {
          filter: "drop-shadow( 0px 0px 10px rgba(0, 0, 0, .2))",
        },
        _hover: "none"
      },
      arrow: {
        border: "none",
      },
      body: {
        background: "white.500",
        p: "6px"
      }
      // bgColor: "brand.500",
      // color: "white",
      // transitionProperty: "common",
      // transitionDuration: "normal",
      // textTransform: "uppercase",
      // fontSize: "16px",
      // fontWeight: 500,
      // borderRadius: "30px",
      // height: "40px",
      // px: "24px",
      // _hover: {
      //   bgColor: "brand.600",
      //   // cursor: 'pointer',
      //   _disabled: {
      //     bg: "initial",
      //   },
      // },

      // _disabled: {
      //   opacity: 0.4,
      //   cursor: "not-allowed",
      //   boxShadow: "none",
      // },
    },
  },
};

export default Popover;
