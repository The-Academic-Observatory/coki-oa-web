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
// Author: Aniek Roelofs

const Checkbox = {
  baseStyle: {
    label: {
      textTransform: "uppercase",
      fontVariantNumeric: "tabular-nums",
    },
    control: {
      borderColor: "checkbox.500",
      _focus: {
        boxShadow: "none",
      },
    },
  },
  variants: {
    filterForm: {
      label: {
        fontWeight: 500,
        fontSize: { base: "18px", md: "14px" },
      },
    },
    checkboxTreeChild: {
      label: {
        fontWeight: 500,
        fontSize: { base: "18px", md: "14px" },
        lineHeight: { base: "20px", md: "16px" },
      },
    },
    checkboxTreeParent: {
      control: {
        // Stops label from being clicked
        my: "3px",
        mx: "2px",
      },
    },
  },
};

export default Checkbox;
