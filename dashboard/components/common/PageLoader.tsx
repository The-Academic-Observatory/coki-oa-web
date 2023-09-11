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

import { Progress } from "@chakra-ui/react";
import React, { memo } from "react";

interface PageLoaderProps {
  isLoading: boolean;
  minDelay?: number;
}

const PageLoader = ({ isLoading, minDelay = 800 }: PageLoaderProps) => {
  const [isVisible, setVisible] = React.useState(false);
  const [startTime, setStartTime] = React.useState<number>(0);

  React.useEffect(() => {
    if (isLoading) {
      // Set loading to true
      setStartTime(new Date().getTime());
      setVisible(true);
    } else if (!isLoading) {
      // Calculate time since loading was set true
      const diff = new Date().getTime() - startTime;
      if (diff >= minDelay) {
        // If has been loading for more than minDelay set visible to false
        setVisible(false);
      } else {
        // If has been loading for less than minDelay, then use a timer to set the loader to false
        const remainingTime = minDelay - diff;
        let timer = setTimeout(() => {
          setVisible(false);
        }, remainingTime);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [minDelay, startTime, isLoading]);

  return (
    <>
      {isVisible && (
        <Progress
          colorScheme="brand"
          size="xs"
          isIndeterminate
          position="fixed"
          top={0}
          left={0}
          zIndex={10}
          width="100%"
          variant="pageLoadProgress"
        />
      )}
    </>
  );
};

export default memo(PageLoader);
