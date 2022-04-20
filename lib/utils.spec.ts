import { sum, toReadableNumber, largestRemainder } from "./utils";

test("test toReadableNumber", () => {
  expect(toReadableNumber(0)).toBe("0");
  expect(toReadableNumber(9999)).toBe("9,999");
  expect(toReadableNumber(9999)).toBe("9,999");
  expect(toReadableNumber(10000)).toBe("10k");
  expect(toReadableNumber(10001)).toBe("10k");
  expect(toReadableNumber(999999)).toBe("999k");
  expect(toReadableNumber(1000000)).toBe("1m");
  expect(toReadableNumber(1000001)).toBe("1m");
  expect(toReadableNumber(1249925)).toBe("1.2m");
  expect(toReadableNumber(999999999)).toBe("999m");
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
