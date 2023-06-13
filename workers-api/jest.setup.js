// From here https://raw.githubusercontent.com/P-Copley/jest-sorted/master/src/sorted.js
// ISC license
// From jest-environment-miniflare 2.8.0 adding jest-sorted or jest-extended to setupFilesAfterEnv results
// in an error finding the global jest expect

const defaultCompare = (a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

const toBeSorted = (received, options = {}) => {
  if (!received[Symbol.iterator]) {
    return {
      pass: false,
      message: () => `${received} is not iterable and cannot be sorted`,
    };
  }
  const iterable = [...received];

  const { descending = false, key, coerce = false, strict = true, compare = defaultCompare } = options;
  const descMult = descending ? -1 : 1;
  const arrayMsg = key ? `Array(${iterable.length})` : `[${iterable}]`;
  const orderMsg = descending ? "descending" : "ascending";
  let keyMsg = key ? `by ${key} ` : "";
  let failingElements = "";

  let pass = true;

  // we're accessing the next element where we would compare with undefined.
  for (let i = 0; i < iterable.length - 1; i++) {
    let ele = iterable[i];
    let nextEle = iterable[i + 1];
    if (key) {
      if (strict && !(key in ele)) {
        pass = false;
        keyMsg = `by a missing key, ${key}, `;
        break;
      }
      ele = ele[key];
      nextEle = nextEle && nextEle[key];
    }
    if (coerce) {
      ele = +ele;
      nextEle = +nextEle;
    }
    if (descMult * compare(ele, nextEle) > 0) {
      pass = false;
      const eleOrder = descending ? "before" : "after";
      const strEle = JSON.stringify(ele);
      const strNextEle = JSON.stringify(nextEle);
      failingElements = `\nExpected ${strEle} to be ${eleOrder} ${strNextEle}`;
      break;
    }
  }

  const passMsg = pass ? "not " : "";
  const errMsg = `Expected ${arrayMsg} to ${passMsg}be sorted ${keyMsg}in ${orderMsg} order${failingElements}`;
  return {
    pass,
    message: () => errMsg,
  };
};

expect.extend({ toBeSorted });

// ReferenceError: setImmediate is not defined
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
