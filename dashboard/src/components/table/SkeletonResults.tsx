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

import React, { memo } from "react";
import { HStack, Skeleton, SkeletonCircle, Td, Tr } from "@chakra-ui/react";

interface SkeletonResultsProps {
  nRows: number;
}

const SkeletonResults = ({ nRows }: SkeletonResultsProps) => {
  const color = "rgb(226, 232, 240)";

  return (
    <>
      {Array.from(Array(nRows).keys()).map((key) => {
        return (
          <Tr key={key} role="row" zIndex="1" data-test={key}>
            <Td role="cell">
              {/*Logo & name*/}
              <HStack mr="1%">
                <SkeletonCircle startColor={color} endColor={color} size="16px" />
                <Skeleton startColor={color} endColor={color} height="16px" flex="1" />
              </HStack>
            </Td>
            <Td role="cell">
              {/*Open*/}
              <Skeleton startColor={color} endColor={color} height="16px" width="40px" />
            </Td>
            <Td role="cell">
              {/*Breakdown*/}
              <Skeleton startColor={color} endColor={color} height="16px" width="100px" />
            </Td>
            <Td role="cell">
              {/* Total pubs*/}
              <Skeleton startColor={color} endColor={color} height="16px" width="80px" mr={0} />
            </Td>
            <Td role="cell">
              {/*Open pubs*/}
              <Skeleton startColor={color} endColor={color} height="16px" width="80px" mr={0} />
            </Td>
            <Td role="cell">
              {/*Learn more*/}
              <Skeleton startColor={color} endColor={color} height="16px" width="80px" />
            </Td>
          </Tr>
        );
      })}
    </>
  );
};

export default memo(SkeletonResults);
