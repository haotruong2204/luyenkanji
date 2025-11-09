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
