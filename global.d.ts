/**
 * Type definitions for kanjivganimate
 * https://github.com/nihongodera/kanjivganimate
 */
declare module "kanjivganimate" {
  class KanjivgAnimate {
    constructor(selector: Element | string, animationSpeed?: number);
  }
  export default KanjivgAnimate;
}

type KanjiInfo = {
  id: string;
  hanzi?: string;
  story?: string;
  kanjialiveData?: any;
  jishoData?: KanjiParseResult | null;
};

interface BothGraphData {
  withOutLinks: GraphData;
  noOutLinks: GraphData;
}
