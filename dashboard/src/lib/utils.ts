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

import React from "react";

const NUMBER_FORMAT = Intl.NumberFormat("en", { notation: "compact" });

export function toCompactNumber(value: number) {
  return NUMBER_FORMAT.format(value);
}

export function fromCompactNumber(value: string): number {
  const multipliers: { [key: string]: number } = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };

  // ([0-9.]+): the first group which captures the number
  // ([KMBT])?/): the second group which captures the multiplier
  const match = value.match(/([0-9.]+)([KMBT])?/);
  if (!match) {
    return NaN;
  }

  const numberPart = parseFloat(match[1]);
  const multiplierPart = match[2] ? multipliers[match[2]] : 1;

  return numberPart * multiplierPart;
}

export function findMaxForCompactFormat(input: number) {
  let currentValue = input;
  let step = 1;

  while (true) {
    // Get the compact format for current value
    const compactValue = toCompactNumber(currentValue);

    // Get the numeric value of the compact format
    const compactNumber = fromCompactNumber(compactValue);

    // Return compactNumber if compact number is greater than or equal to the input
    if (compactNumber >= input) {
      return compactNumber;
    }

    // Dynamically adjust step size
    if (currentValue >= 1000) step = 1000; // Adjust for thousands
    if (currentValue >= 1000000) step = 100000; // Adjust for millions

    // Increment to test the next number
    currentValue += step;
  }
}

export function sum(input: Array<number>): number {
  return input.reduce((a: number, b: number) => a + b, 0);
}

export function largestRemainder(samples: Array<number>): Array<number> {
  // Round a list of numbers that sum to 100 using the largest remainder method: https://en.wikipedia.org/wiki/Largest_remainder_method.

  const sampleSize = 100;
  const total = sum(samples);
  const diff = Math.abs(sampleSize - total);
  if (diff > 1e-9) {
    throw Error("samples must sum to 100");
  }
  let samplesCopy = [...samples];
  let sizesWhole = samplesCopy.map((sample) => {
    return Math.floor(sample);
  });
  while (sampleSize - sum(sizesWhole) > 0) {
    const remainders = samplesCopy.map((sample) => {
      return sample % 1;
    });
    const maxIndex = remainders.indexOf(Math.max(...remainders));
    sizesWhole[maxIndex] = sizesWhole[maxIndex] + 1;
    samplesCopy[maxIndex] = sizesWhole[maxIndex];
  }
  return sizesWhole;
}

export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  const firstDebounce = React.useRef(true);
  React.useEffect(() => {
    if (value && firstDebounce.current) {
      setDebouncedValue(value);
      firstDebounce.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
