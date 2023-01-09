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
import DonutSparkline from "../charts/DonutSparkline";
import React, { memo } from "react";
import { EntityProps, makeHref } from "./IndexTable";

function OpenCell({ value, entity }: EntityProps) {
  const href = makeHref(entity.entity_type, entity.id);
  return (
    <Link href={href}>
      <DonutSparkline value={value} color="#f47328" size={18} />
    </Link>
  );
}

export default memo(OpenCell);
