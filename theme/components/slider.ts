// Copyright 2022Curtin University
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

const Slider = {
  variants: {
    filterForm: {
      track: {
        bg: "#E1E1E1",
        height: "5px",
        borderRadius: "5px",
      },
      filledTrack: {
        bg: "grey.800",
      },
      thumb: {
        borderColor: "brand.500",
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
};

export default Slider;
