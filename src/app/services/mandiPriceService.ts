const PAGE_SIZE = 10;

export interface PriceRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export async function fetchMandiPrices(
  filters: Record<string, string>,
  page: number
): Promise<{ records: PriceRecord[]; hasMore: boolean }> {
  const paramsObj: Record<string, string> = {
    "api-key": process.env.NEXT_PUBLIC_MANDI_API_KEY || "",
    format: "json",
    limit: PAGE_SIZE.toString(),
    offset: ((page - 1) * PAGE_SIZE).toString(),
  };

  if (filters.state) paramsObj["filters[state.keyword]"] = filters.state;
  if (filters.district) paramsObj["filters[district]"] = filters.district;
  if (filters.market) paramsObj["filters[market]"] = filters.market;
  if (filters.commodity) paramsObj["filters[commodity]"] = filters.commodity;
  if (filters.variety) paramsObj["filters[variety]"] = filters.variety;
  if (filters.grade) paramsObj["filters[grade]"] = filters.grade;

  const params = new URLSearchParams(paramsObj);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MANDI_URL}?${params.toString()}`
  );
  const data = await res.json();
  return {
    records: Array.isArray(data.records) ? data.records : [],
    hasMore: Array.isArray(data.records) && data.records.length === PAGE_SIZE,
  };
}
