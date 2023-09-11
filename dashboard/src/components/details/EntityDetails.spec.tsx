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

import { EntityDetails, makePageDescription } from "@/components/details";
import { makeSocialCardUrl } from "@/lib/api";
import { render } from "@/lib/test-utils";

import entity from "@data/data/country/NZL.json";
import stats from "@data/data/stats.json";

import { useRouter } from "next/router";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock next/head
jest.mock(
  "next/head",
  () =>
    function Head({ children }: { children: Array<React.ReactElement> }) {
      return <>{children}</>;
    },
);

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test("test makePageDescription country", () => {
  // Below median country
  let entity = {
    name: "New Zealand",
    entity_type: "country",
    start_year: 2000,
    end_year: 2021,
    stats: {
      p_outputs_open: 37,
    },
  };
  let stats = { country: { median: { p_outputs_open: 40 } } };
  let description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "37% of New Zealand's published academic research is freely available on the internet. Open Access statistics for New Zealand, covering academic research published from 2000 to 2021.",
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
    entity_type: "institution",
    country_name: "Australia",
    start_year: 2000,
    end_year: 2021,
    stats: {
      p_outputs_open: 37,
    },
  };
  let stats = { institution: { median: { p_outputs_open: 40 } } };
  let description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "37% of Curtin University's published academic research is freely available on the internet. Open Access statistics for Curtin University, Australia, covering academic research published from 2000 to 2021.",
  );

  // Equal to or above median
  entity.stats.p_outputs_open = 40;
  description = makePageDescription(entity, stats);
  expect(description).toEqual(
    "Over 40% of Curtin University's published academic research is freely available on the internet. Open Access statistics for Curtin University, Australia, covering academic research published from 2000 to 2021.",
  );
});

it("EntityDetails component renders Head metadata", () => {
  // Mock useRouter.asPath
  useRouter.mockImplementation(() => ({
    asPath: "/",
  }));

  const pageUrl = `${process.env.COKI_SITE_URL}${useRouter().asPath}`;

  render(<EntityDetails entity={entity} stats={stats} />);
  const description = makePageDescription(entity, stats);
  const expectedTitle = "New Zealand's Open Access Research Performance";

  expect(document.title).toBe("COKI: New Zealand");
  expect(document.body.querySelector("meta[name='description']").content).toBe(description);

  // For sharing cards to Twitter
  expect(document.body.querySelector("meta[name='twitter:card']").content).toBe("summary_large_image");
  expect(document.body.querySelector("meta[name='twitter:site']").content).toBe("@COKIproject");
  expect(document.body.querySelector("meta[name='twitter:image']").content).toBe(makeSocialCardUrl(entity.id));
  expect(document.body.querySelector("meta[name='twitter:title']").content).toBe(expectedTitle);
  expect(document.body.querySelector("meta[name='twitter:description']").content).toBe(description);
  expect(document.body.querySelector("meta[name='twitter:image:alt']").content).toBe(description);

  // For sharing cards to Facebook and LinkedIn
  expect(document.body.querySelector("meta[property='og:title']").content).toBe(expectedTitle);
  expect(document.body.querySelector("meta[property='og:image']").content).toBe(makeSocialCardUrl(entity.id));
  expect(document.body.querySelector("meta[property='og:description']").content).toBe(description);
  expect(document.body.querySelector("meta[property='og:url']").content).toBe(pageUrl);
});
