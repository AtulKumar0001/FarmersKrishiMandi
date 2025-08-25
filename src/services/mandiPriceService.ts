const API_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
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
  const params = new URLSearchParams({
    "api-key": API_KEY,
    format: "json",
    limit: PAGE_SIZE.toString(),
    offset: ((page - 1) * PAGE_SIZE).toString(),
    ...(filters.state && { "filters[state.keyword]": filters.state }),
    ...(filters.district && { "filters[district]": filters.district }),
    ...(filters.market && { "filters[market]": filters.market }),
    ...(filters.commodity && { "filters[commodity]": filters.commodity }),
    ...(filters.variety && { "filters[variety]": filters.variety }),
    ...(filters.grade && { "filters[grade]": filters.grade }),
  });

  const res = await fetch(`${API_URL}?${params.toString()}`);
  const data = await res.json();
  return {
    records: Array.isArray(data.records) ? data.records : [],
    hasMore: Array.isArray(data.records) && data.records.length === PAGE_SIZE,
  };
}
