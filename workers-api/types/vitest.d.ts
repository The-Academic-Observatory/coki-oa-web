import type { Assertion, AsymmetricMatchersContaining } from "vitest";

interface CustomMatchers<R = unknown> {
  toBeSorted(options?: {
    descending?: boolean;
    coerce?: boolean;
    key?: string;
    strict?: boolean;
    compare?: CallableFunction;
  }): R;
}

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}

  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
