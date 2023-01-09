import { sum, toReadableNumber, largestRemainder } from "./utils";

test("test toReadableNumber", () => {
  expect(toReadableNumber(0)).toBe("0");
  expect(toReadableNumber(9999)).toBe("10K");
  expect(toReadableNumber(10000)).toBe("10K");
  expect(toReadableNumber(10499)).toBe("10K");
  expect(toReadableNumber(10999)).toBe("11K");
  expect(toReadableNumber(999999)).toBe("1M");
  expect(toReadableNumber(1000000)).toBe("1M");
  expect(toReadableNumber(1500000)).toBe("1.5M");
  expect(toReadableNumber(1999999)).toBe("2M");
  expect(toReadableNumber(999999999)).toBe("1B");
});

test("test sum", () => {
  let total = sum([0, 1, 2, 3]);
  expect(total).toBe(6);

  total = sum([]);
  expect(total).toBe(0);

  total = sum([0]);
  expect(total).toBe(0);
});

test("test largestRemainder", () => {
  expect(() => {
    largestRemainder([0.1, 0.4, 100]);
  }).toThrow();

  let samples = [11.1, 21.9, 67];
  let results = largestRemainder(samples);
  expect(results).toStrictEqual([11, 22, 67]);

  samples = [11.8, 21.8, 66.4];
  results = largestRemainder(samples);
  expect(results).toStrictEqual([12, 22, 66]);
});
