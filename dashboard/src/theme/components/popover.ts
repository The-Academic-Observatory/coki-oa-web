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
// Author: Alex Massen-Hane

const Popover = {
  variants: {
    sharePopover: {
      arrow: {
        ml: { base: "9px", md: 0 }, // Makes sure that the arrow is centred on the button on mobile
      },
      content: {
        border: "none",
        width: "min-content",
        height: "min-content",
        mr: { base: "18px", md: 0 }, // Stops popover from overlapping right edge of screen on mobile
        boxShadow: "0px 5px 12px 1px rgba(0,0,0,0.2)",
        _focus: {
          boxShadow: "0px 5px 12px 1px rgba(0,0,0,0.2)",
        },
      },
      body: {
        p: "12px",
      },
    },
  },
};

export default Popover;
