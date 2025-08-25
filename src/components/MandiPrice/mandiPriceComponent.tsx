"use client";
import React, { useState, useEffect } from "react";
import { fetchMandiPrices, PriceRecord } from "../../services/mandiPriceService";
import MandiPriceTable from "./MandiPriceTable";

export default function MandiPrice() {
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    market: "",
    commodity: "",
    variety: "",
    grade: "",
  });
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMandiPrices(filters, page).then((data) => {
      setPrices(data.records);
      setHasMore(data.hasMore);
      setLoading(false);
    });
  }, [filters, page]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 px-2">
      <h1 className="text-4xl font-bold text-center mb-8">Mandi Price</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            name="state"
            value={filters.state}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="State"
          />
          <input
            name="district"
            value={filters.district}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="District"
          />
          <input
            name="market"
            value={filters.market}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Market"
          />
          <input
            name="commodity"
            value={filters.commodity}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Commodity"
          />
          <input
            name="variety"
            value={filters.variety}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Variety"
          />
          <input
            name="grade"
            value={filters.grade}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Grade"
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <MandiPriceTable prices={prices} />
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold disabled:opacity-50 transition"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="font-semibold text-lg">Page {page}</span>
            <button
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold disabled:opacity-50 transition"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}