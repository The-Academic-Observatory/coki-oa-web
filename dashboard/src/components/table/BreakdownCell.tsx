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

import { BreakdownSparkline } from "@/components/charts";
import { Link } from "@/components/common";
import { EntityProps, makeHref } from "@/components/table";
import React, { memo } from "react";

function BreakdownCell({ entity }: EntityProps) {
  const href = makeHref(entity.entity_type, entity.id);
  let oa_status = entity.oa_status;
  let values = [
    oa_status.publisher_only.percent,
    oa_status.both.percent,
    oa_status.other_platform_only.percent,
    oa_status.closed.percent,
  ];
  const colors = ["#ffd700", "#4fa9dc", "#9FD27E", "#EBEBEB"];
  return (
    <Link href={href}>
      <BreakdownSparkline values={values} colors={colors} width={110} height={17} />
    </Link>
  );
}

export default memo(BreakdownCell);
