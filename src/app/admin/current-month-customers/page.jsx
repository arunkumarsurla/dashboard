"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Users, Calendar, Search, X, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { fetchCustomers } from "@/services/customers";
import CustomerDetails from "@/components/modals/CustomerDetails";
import { PageHeader, PageSpinner, EmptyState, TableWrapper, THead } from "@/components/ui";
import { MONTHS } from "@/utils/constants";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const COLS = [
  { label: 'Customer' },
  { label: 'Area' },
  { label: 'Brand' },
  { label: 'Plan' },
  { label: 'Registered' },
];

export default function CurrentMonthCustomersPage() {
  const getNow = () => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  };

  const [{ month, year }, setDate] = useState(getNow());
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchCustomers();
      const filtered = all.filter((c) => {
        const d = new Date(c.register_date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
      setCustomers(filtered);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    load();
  }, [load]);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.area && c.area.toLowerCase().includes(q)) ||
        (c.brand && c.brand.toLowerCase().includes(q))
    );
  }, [customers, search]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [month, year, search]);


  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, filtered.length);

  return (
    <>
      <PageHeader
        title="Monthly Customers"
        subtitle={`${filtered.length} customer${filtered.length !== 1 ? "s" : ""} in ${MONTHS[month]} ${year}`}
        action={
          <button onClick={load} className="p-2 rounded hover:bg-slate-100" title="Refresh">
            <RefreshCw size={18} />
          </button>
        }
      />

      {/* Month/Year Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#1e3a8a" }} size={18} />
          <input
            type="text"
            placeholder="Search by name, phone, area, or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border-2 rounded-lg text-sm focus:outline-none focus:ring-2 shadow-sm"
            style={{ borderColor: "#1e3a8a33" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white border-2 rounded-lg px-3 shadow-sm" style={{ borderColor: "#1e3a8a33" }}>
          <Calendar size={15} className="text-slate-400 shrink-0" />
          <select
            value={month}
            onChange={(e) => setDate((prev) => ({ ...prev, month: +e.target.value }))}
            className="w-full py-2.5 text-sm focus:outline-none bg-transparent text-slate-700 font-semibold"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>

        <div className="flex items-center bg-white border-2 rounded-lg px-3 shadow-sm" style={{ borderColor: "#1e3a8a33" }}>
          <select
            value={year}
            onChange={(e) => setDate((prev) => ({ ...prev, year: +e.target.value }))}
            className="w-full py-2.5 text-sm focus:outline-none bg-transparent text-slate-700 font-semibold"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}{y === currentYear ? " (This Year)" : ""}</option>
            ))}
          </select>
        </div>

      </div>
{loading ? <PageSpinner /> : (
        <>
          <TableWrapper>
            <THead cols={COLS} />
            <tbody>
              {paginated.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors"
                  style={{ backgroundColor: i % 2 !== 0 ? '#f8faff' : 'white' }}
                >
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-bold text-sm text-blue-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{c.area || "—"}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{c.brand || "—"}</td>
                  <td className="px-4 py-3.5">
                    {c.service ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {c.service}M
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">
                    {new Date(c.register_date).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>

          {filtered.length === 0 && (
            <EmptyState icon={Users} title="No customers found" />
          )}

          {/* Pagination - Inline JSX */}
          {filtered.length > 0 && totalPages > 1 && (
            <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 bg-white rounded-b-lg">
              {/* Left: Page Size & Info */}
              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer hover:border-slate-300 transition-colors"
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s} / page</option>
                  ))}
                </select>
                <span className="text-sm text-slate-600">
                  Showing <span className="font-medium text-slate-900">{startItem}</span> to <span className="font-medium text-slate-900">{endItem}</span> of <span className="font-medium text-slate-900">{filtered.length}</span>
                </span>
              </div>

              {/* Right: Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} className="text-slate-700" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || 
                             page === totalPages || 
                             (page >= currentPage - 1 && page <= currentPage + 1);
                    })
                    .map((page, index, array) => {
                      // Add ellipsis where there are gaps
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-3 py-2 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[36px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} className="text-slate-700" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Customer Details Modal - View Only (No Edit) */}
      {selected && (
        <CustomerDetails 
          customer={selected} 
          onClose={() => setSelected(null)} 
          readOnly={true}
        />
      )}
    </>
  );
}