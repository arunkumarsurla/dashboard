"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { fetchCustomers, updateCustomerStatus } from "@/services/customers";
import { getExpiryDate, daysFromToday, fmtDate } from "@/utils/dates";
import { PageHeader, PageSpinner, TableWrapper, THead } from "@/components/ui";

const COLS = [
  { label: "Customer" },
  { label: "Phone" },
  { label: "Area", hidden: "hidden md:table-cell" },
  { label: "Plan" },
  { label: "Expired On" },
  { label: "Overdue" },
  { label: "Status" },
];

export default function ServiceDelayPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const all = await fetchCustomers();
      setCustomers(
        all.filter((c) => {
          if (c.follow_up_status === "completed") return false;
          return daysFromToday(c.last_service_date, c.service) < 0;
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    if (!id) return;
    await updateCustomerStatus(id, status);
    load();
  };

  if (loading) return <PageSpinner />;

  return (
    <>
      <PageHeader
        title="Service Delay"
        subtitle={`${customers.length} customer${customers.length !== 1 ? "s" : ""} with overdue service`}
      />

      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={38} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">No Delays!</h2>
          <p className="text-slate-400 text-sm">All services are up to date.</p>
        </div>
      ) : (
        <TableWrapper>
          <THead cols={COLS} />
          <tbody>
            {customers.map((c, i) => {
              const expiry = getExpiryDate(c.last_service_date, c.service);
              const overdue = Math.abs(
                daysFromToday(c.last_service_date, c.service),
              );

              return (
                <tr
                  key={c.id}
                  className="border-b border-slate-50"
                  style={{ backgroundColor: i % 2 !== 0 ? "#fff5f5" : "white" }}
                >
                  <td className="px-4 py-3.5 font-bold text-sm text-blue-900">
                    {c.name}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {c.area}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">
                    {c.service}M
                  </td>
                  <td className="px-4 py-3.5 text-sm text-red-600 font-semibold">
                    {expiry ? fmtDate(expiry.toISOString()) : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700">
                      {overdue}d overdue
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={c.follow_up_status || "pending"}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${
                        c.follow_up_status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <option value="pending">Not Done</option>
                      <option value="completed">Done</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableWrapper>
      )}
    </>
  );
}
