import React, { DependencyList, EffectCallback, RefObject, useEffect, useRef } from "react";
import * as d3 from "d3";

export const useD3 = (
  renderChartFunc: (svg: d3.Selection<SVGSVGElement | null, any, any, any>) => void,
  deps: DependencyList,
): RefObject<SVGSVGElement> => {
  const ref = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    renderChartFunc(d3.select(ref.current));
    return () => {};
  }, deps);
  return ref;
};

// In development environment useEffect mounts twice before the page has fully rendered
// reactStrictMode: true should be on when developing
let CALLBACK_THRESH = 1;
if (process.env.NODE_ENV === "development") {
  CALLBACK_THRESH = 2;
}

export const useEffectAfterRender = (callback: EffectCallback, deps?: DependencyList) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

    // Only run callback if we have passed CALLBACK_THRESH
    if (renderCount.current > CALLBACK_THRESH) {
      callback();
    }
  }, deps);
};
