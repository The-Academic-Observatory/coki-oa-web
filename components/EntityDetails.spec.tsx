import { render } from "@testing-library/react";
import { EntityDetails, makePageDescription } from "./EntityDetails";

import entity from "../latest/data/country/NZL.json";
import stats from "../latest/data/stats.json";

// Mock Next head
jest.mock(
  "next/head",
  () =>
    function Head({ children }: { children: Array<React.ReactElement> }) {
      return <>{children}</>;
    },
);

const buildId = "9wunlCAp5nAMZGCCOIDUx";
const publicHost = "http://127.0.0.1:3000";

it("EntityDetails component renders Head metadata", () => {
  // @ts-ignore
  render(<EntityDetails entity={entity} stats={stats} />);

  // @ts-ignore
  const description = makePageDescription(entity, stats);
  expect(document.title).toBe("COKI: New Zealand");
  // @ts-ignore
  expect(document.body.querySelector("meta[name='description']").content).toBe(description);
  // @ts-ignore
  expect(document.body.querySelector("meta[name='twitter:card']").content).toBe("summary_large_image");
  // @ts-ignore
  expect(document.body.querySelector("meta[name='twitter:site']").content).toBe("@COKIproject");
  // @ts-ignore
  expect(document.body.querySelector("meta[name='twitter:image']").content).toBe(
    `${publicHost}/twitter/NZL.webp?build=${buildId}`,
  );
  // @ts-ignore
  expect(document.body.querySelector("meta[name='twitter:title']").content).toBe(
    "New Zealand's Open Access Research Performance",
  );
  // @ts-ignore
  expect(document.body.querySelector("meta[name='twitter:description']").content).toBe(description);
  // @ts-ignore
  expect(document.body.querySelector("meta[name='twitter:image:alt']").content).toBe(description);
});
