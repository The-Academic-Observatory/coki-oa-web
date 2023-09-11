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

import { Box, BoxProps } from "@chakra-ui/react";
import { linearGradientDef } from "@nivo/core";
import { Pie } from "@nivo/pie";
import React, { memo, useState } from "react";

interface PublisherOpenDonutProps extends BoxProps {
  data: Array<any>;
}

const PublisherOpenDonut = ({ data, ...rest }: PublisherOpenDonutProps) => {
  const fontFamily = "brandon-grotesque";
  const margin = 20;
  const [i, setIndex] = useState(0);

  const CentreText = ({ dataWithArc, centerX, centerY }: any) => {
    const data = dataWithArc[i];
    return (
      <text textAnchor="middle" y={centerY + 6}>
        <tspan x={centerX} dy="0em" style={{ fontSize: "48px", fontFamily: fontFamily, fontWeight: 900 }}>
          {data.value}%
        </tspan>
        <tspan
          x={centerX}
          dy="1.2em"
          style={{
            fontWeight: 900,
            fontSize: "16px",
            fontFamily: fontFamily,
            textTransform: "uppercase",
          }}
        >
          {data.label}
        </tspan>
      </text>
    );
  };

  return (
    <Box className="publisherOpenDonut" {...rest}>
      <Pie
        colors={{ datum: "data.color" }}
        innerRadius={0.6}
        width={300}
        height={300}
        tooltip={({ datum: { id, value, color } }) => <></>}
        margin={{ top: margin, right: margin, bottom: margin, left: margin }}
        data={data}
        layers={["arcs", CentreText]}
        onMouseEnter={(node, event) => {
          // Set index, which is used by CentreText to decide which datapoint to render in the middle
          setIndex(node.arc.index);
        }}
        animate={true}
        activeOuterRadiusOffset={3}
        defs={[
          linearGradientDef("gold", [
            { offset: 0, color: "#fdd500" },
            { offset: 100, color: "#d1b100" },
          ]),
        ]}
        fill={[
          // match using object query
          { match: { id: "OA Journal" }, id: "gold" },
        ]}
      />
    </Box>
  );
};

export default memo(PublisherOpenDonut);
