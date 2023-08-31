// Source: https://github.com/P-Copley/jest-sorted/blob/master/src/sorted.js
// ISC license: https://github.com/P-Copley/jest-sorted/blob/a9876292cf7d599a92f66b7292f8baf488477a98/package.json#L21

const defaultCompare = (a: any, b: any) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

export function toBeSorted(received: any, options: any = {}) {
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
}
