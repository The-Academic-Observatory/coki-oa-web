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

import ittyRouter from "itty-router";
import { searchHandler } from "@/search";
import { countriesHandler, institutionsHandler } from "@/filter";
import { downloadDataZipHandler } from "@/downloadZip";
import { fetchEntityHandler } from "@/entity";
const { Router } = ittyRouter;

// Setup API router
export const router = Router({ base: "/" });
router
  .get("/search/:text", searchHandler) // Search all countries and institutions with full text search
  .get("/:entityType/:id", fetchEntityHandler) // Get the full details for a single country or institution
  .get("/countries", countriesHandler) // Filter countries
  .get("/institutions", institutionsHandler) // Filter institutions
  .get("/download/:entityType/:id", downloadDataZipHandler) // For frontend download of entity data in a zip
  .get(
    "*",
    () =>
      new Response("Not found", {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "application/json",
        },
      }),
  );

export async function handleRequest(request: Request, env: Record<string, any>, ctx: ExecutionContext) {
  return router.handle(request, env, ctx);
}
