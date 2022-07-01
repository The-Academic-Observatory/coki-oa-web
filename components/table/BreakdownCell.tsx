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

import Link from "../common/Link";
import BreakdownSparkline from "../charts/BreakdownSparkline";
import React, { memo } from "react";
import { EntityProps, makeHref } from "./IndexTable";

function BreakdownCell({ entity }: EntityProps) {
  const href = makeHref(entity.category, entity.id);
  let stats = entity.stats;
  let values = [
    stats.p_outputs_publisher_open_only,
    stats.p_outputs_both,
    stats.p_outputs_other_platform_open_only,
    stats.p_outputs_closed,
  ];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];
  return (
    <Link href={href}>
      <BreakdownSparkline values={values} colors={colors} width={110} height={17} />
    </Link>
  );
}

export default memo(BreakdownCell);
