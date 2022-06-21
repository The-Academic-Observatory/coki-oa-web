import { render } from "@testing-library/react";
import { EntityDetails, makePageDescription, makeTwitterImageUrl } from "./EntityDetails";

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

test("test makeTwitterImageUrl", () => {
  let url = makeTwitterImageUrl("NZL");
  expect(url).toEqual(`${publicHost}/twitter/NZL.webp?build=${buildId}`);
});

test("test makePageDescription country", () => {
  // Below median country
  let entity = {
    name: "New Zealand",
    category: "country",
    start_year: 2000,
    end_year: 2021,
    stats: {
      p_outputs_open: 37,
    },
  };
  let stats = { country_medians: { p_outputs_open: 40 } };
  let description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "Only 37% of New Zealand's published academic research is freely available on the internet. Open Access statistics for New Zealand, covering academic research published from 2000 to 2021.",
  );

  // Equal to or above median
  entity.stats.p_outputs_open = 40;
  description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "Over 40% of New Zealand's published academic research is freely available on the internet. Open Access statistics for New Zealand, covering academic research published from 2000 to 2021.",
  );
});

test("test makePageDescription institution", () => {
  // Below median country
  let entity = {
    name: "Curtin University",
    category: "institution",
    country: "Australia",
    start_year: 2000,
    end_year: 2021,
    stats: {
      p_outputs_open: 37,
    },
  };
  let stats = { institution_medians: { p_outputs_open: 40 } };
  let description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "Only 37% of Curtin University's published academic research is freely available on the internet. Open Access statistics for Curtin University, Australia, covering academic research published from 2000 to 2021.",
  );

  // Equal to or above median
  entity.stats.p_outputs_open = 40;
  description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "Over 40% of Curtin University's published academic research is freely available on the internet. Open Access statistics for Curtin University, Australia, covering academic research published from 2000 to 2021.",
  );
});

it("EntityDetails component renders Head metadata", () => {
  render(<EntityDetails entity={entity} stats={stats} />);
  const description = makePageDescription(entity, stats);
  expect(document.title).toBe("COKI: New Zealand");
  expect(document.body.querySelector("meta[name='description']").content).toBe(description);
  expect(document.body.querySelector("meta[name='twitter:card']").content).toBe("summary_large_image");
  expect(document.body.querySelector("meta[name='twitter:site']").content).toBe("@COKIproject");
  expect(document.body.querySelector("meta[name='twitter:image']").content).toBe(makeTwitterImageUrl(entity.id));
  expect(document.body.querySelector("meta[name='twitter:title']").content).toBe(
    "New Zealand's Open Access Research Performance",
  );
  expect(document.body.querySelector("meta[name='twitter:description']").content).toBe(description);
  expect(document.body.querySelector("meta[name='twitter:image:alt']").content).toBe(description);
});
