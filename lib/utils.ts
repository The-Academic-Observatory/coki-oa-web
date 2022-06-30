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

export function toReadableNumber(value: number) {
  if (value < 1e4) {
    // For values below 10,000
    return Math.trunc(value).toLocaleString();
  } else if (value < 1e6) {
    // For values between 10,000 and 999,999 inclusive
    // Convert to thousandths
    value = Math.round(value / 1000);
    if (value < 1000) {
      return `${value}k`;
    } else {
      return `${value / 1000}m`;
    }
  } else if (value < 1e9) {
    // For values from 1,000,000 and above
    let result: string | number = "";

    // Convert to millionths
    value = value / 1e6;
    result = parseFloat(value.toFixed(1));
    if (value > 100 || result % 1 == 0) {
      // When greater than 100 million or when last digit is not 0
      // remove all decimals without rounding
      result = Math.trunc(result);
    }
    return `${result}m`;
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
