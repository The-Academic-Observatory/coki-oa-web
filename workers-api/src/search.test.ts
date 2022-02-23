import { search, searchHandler } from "./search";

test("test search", () => {
  let text = "south";

  // 1 result
  let limit = 1;
  let results = search(text, limit);
  expect(results.length).toBe(limit);

  // 5 result
  limit = 5;
  results = search(text, limit);
  expect(results.length).toBe(limit);

  // All results
  limit = 0;
  results = search(text, limit);
  expect(results.length).toBeGreaterThan(40);

  // No text
  text = "";
  limit = 5;
  results = search(text, limit);
  expect(results.length).toBe(0);

  // Check country results schema
  text = "australia";
  limit = 1;
  let result = search(text, limit)[0];
  const expectedCountry = {
    id: "AUS",
    name: "Australia",
    logo_s: "/logos/country/s/AUS.svg",
    category: "country",
    subregion: "Australia and New Zealand",
    region: "Oceania",
    stats: {
      n_outputs: expect.any(Number),
      n_outputs_open: expect.any(Number),
      p_outputs_open: expect.any(Number),
      p_outputs_publisher_open_only: expect.any(Number),
      p_outputs_both: expect.any(Number),
      p_outputs_other_platform_open_only: expect.any(Number),
      p_outputs_closed: expect.any(Number),
    },
  };
  expect(result).toMatchObject(expectedCountry);

  // Check institution results schema
  text = "curtin university";
  limit = 1;
  result = search(text, limit)[0];
  const expectedInstitution = {
    id: "02n415q13",
    name: "Curtin University",
    logo_s: "/logos/institution/s/02n415q13.jpg",
    category: "institution",
    country: "Australia",
    subregion: "Australia and New Zealand",
    region: "Oceania",
    institution_types: ["Education"],
    stats: {
      n_outputs: expect.any(Number),
      n_outputs_open: expect.any(Number),
      p_outputs_open: expect.any(Number),
      p_outputs_publisher_open_only: expect.any(Number),
      p_outputs_both: expect.any(Number),
      p_outputs_other_platform_open_only: expect.any(Number),
      p_outputs_closed: expect.any(Number),
    },
  };
  expect(result).toMatchObject(expectedInstitution);
});
