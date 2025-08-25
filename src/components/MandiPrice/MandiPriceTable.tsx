import React from "react";
import { PriceRecord } from "../../services/mandiPriceService";

interface Props {
  prices: PriceRecord[];
}

export default function MandiPriceTable({ prices }: Props) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm rounded-xl shadow-lg overflow-hidden">
        <thead className="sticky top-0 bg-green-100 dark:bg-green-900 z-10">
          <tr>
            <th className="px-4 py-3 font-semibold">State</th>
            <th className="px-4 py-3 font-semibold">District</th>
            <th className="px-4 py-3 font-semibold">Market</th>
            <th className="px-4 py-3 font-semibold">Commodity</th>
            <th className="px-4 py-3 font-semibold">Variety</th>
            <th className="px-4 py-3 font-semibold">Grade</th>
            <th className="px-4 py-3 font-semibold">Min Price</th>
            <th className="px-4 py-3 font-semibold">Max Price</th>
            <th className="px-4 py-3 font-semibold">Modal Price</th>
          </tr>
        </thead>
        <tbody>
          {prices.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-lg">
                No data found.
              </td>
            </tr>
          ) : (
            prices.map((item, idx) => (
              <tr
                key={idx}
                className={`border-t transition-colors ${
                  idx % 2 === 0
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                } hover:bg-green-50 dark:hover:bg-green-950`}
              >
                <td className="px-4 py-3">{item.state}</td>
                <td className="px-4 py-3">{item.district}</td>
                <td className="px-4 py-3">{item.market}</td>
                <td className="px-4 py-3">{item.commodity}</td>
                <td className="px-4 py-3">{item.variety}</td>
                <td className="px-4 py-3">{item.grade}</td>
                <td className="px-4 py-3">{item.min_price}</td>
                <td className="px-4 py-3">{item.max_price}</td>
                <td className="px-4 py-3">{item.modal_price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
