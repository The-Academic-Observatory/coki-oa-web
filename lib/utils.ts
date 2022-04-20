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

export function toReadableNumber(value: number) {
  if (value < 1e4) {
    // For values below 10,000
    return value.toLocaleString();
  } else if (value < 1e6) {
    // Convert to thousandths
    // Round up to nearest
    value = Math.ceil(value / 1000);
    return `${value}k`;
  } else if (value < 1e9) {
    let result: string = "";

    // Convert to millionths
    value = value / 1e6;
    if (value < 100 && value % 1 != 0) {
      // For not whole numbers just keep 1 dp
      result = value.toFixed(1);
    } else {
      // For whole numbers remove all decimals
      result = value.toFixed(0);
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
