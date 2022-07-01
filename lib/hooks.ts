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

export const useEffectAfterRender = (callback: EffectCallback, deps?: DependencyList) => {
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) {
      // Run callback
      return callback();
    } else {
      // Set render state to true
      isRendered.current = true;
      return;
    }
  }, deps);
};
