import ittyRouter from "itty-router";
import { searchHandler } from "@/search";
import { countriesHandler, institutionsHandler } from "@/filter";
const { Router } = ittyRouter;

// Setup API router
const router = Router();
router
  .get("/api/search/:text", searchHandler)
  .get("/api/countries", countriesHandler)
  .get("/api/institutions", institutionsHandler)
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

export async function handleRequest(request: Request) {
  return router.handle(request);
}
