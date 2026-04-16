"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Download,
  RefreshCw,
  FileClock,
  Trash2,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { fetchAllServiceHistory, fetchServiceHistory, deleteServiceRecord } from "@/services/records";
import { fetchCustomer } from "@/services/customers";
import { generateServiceInvoice } from "@/utils/pdf";
import { fmtDate ,formatDateTime} from "@/utils/dates";
import { MONTHS } from "@/utils/constants";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { PageHeader, PageSpinner } from "@/components/ui";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

function Modal({ onClose, children, maxWidth = "max-w-3xl" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose, color = "#1e3a8a" }) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 rounded-t-xl sticky top-0 z-10"
      style={{ background: color }}
    >
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && (
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Single Service Record Detail Modal
// ─────────────────────────────────────────────────────────────

function ServiceRecordModal({ record, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [fullImg,     setFullImg]     = useState(null);
  const [customer,    setCustomer]    = useState(null);

  // Build customer object from the enriched record fields
  useEffect(() => {
    if (record.customer_id) {
      fetchCustomer(record.customer_id)
        .then(setCustomer)
        .catch(() => {
          // Fallback: construct from flattened record fields
          setCustomer({
            id:    record.customer_id,
            name:  record.customer_name,
            phone: record.customer_phone,
            area:  record.customer_area,
            brand: record.customer_brand,
          });
        });
    }
  }, [record]);
  

  const parts = Object.entries(record.spare_parts || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  const handleDownload = async () => {
    if (!customer) return;
    setDownloading(true);
    try {
      await generateServiceInvoice({
        customer,
        serviceDate: record.register_date,
        savedData: {
          reminderMonths: record.reminder_months,
          totalBill:      record.total_bill,
          paymentMode:    record.payment_mode,
        },
      });
    } finally {
      setDownloading(false);
    }
  };
  

  return (
    <>
      <Modal onClose={onClose} maxWidth="max-w-lg">
        <ModalHeader
          title="Service Details"
          subtitle={`${formatDateTime(record.created_at)} · ${record.customer_name}`}
          onClose={onClose}
          color="#059669"
        />

        <div className="p-6 space-y-4">

          {/* Customer info */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 mb-1">Customer</p>
            <p className="font-bold text-slate-800 text-sm">{record.customer_name}</p>
            <div className="flex flex-wrap gap-3 mt-1">
              {record.customer_phone && (
                <p className="text-xs text-slate-500">📞 +91 {record.customer_phone}</p>
              )}
              {record.customer_area && (
                <p className="text-xs text-slate-500">📍 {record.customer_area}</p>
              )}
              {record.customer_brand && (
                <p className="text-xs text-slate-500">🔧 {record.customer_brand}</p>
              )}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bill Amount", value: `₹${parseFloat(record.total_bill).toLocaleString("en-IN")}` },
              { label: "Payment",     value: record.payment_mode },
              { label: "Next In",     value: `${record.reminder_months}M` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center"
              >
                <p className="font-bold text-slate-800 text-sm">{value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Spare parts */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
            <p className="font-bold text-blue-900 text-sm mb-2">Spare Parts Replaced</p>
            {parts.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {parts.map((p) => (
                  <span key={p} className="text-sm text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No parts replaced this visit</p>
            )}
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-bold text-slate-700 text-sm mb-1">Notes</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}

          {/* Images */}
          {record.images?.length > 0 && (
            <div>
              <p className="font-bold text-slate-700 text-sm mb-2">
                Service Photos ({record.images.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {record.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setFullImg(img)}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg border border-slate-200 cursor-zoom-in hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Download invoice */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleDownload}
              disabled={downloading || !customer}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {downloading
                ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                : <Download size={15} />
              }
              {!customer ? "Loading…" : "Download Invoice"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Fullscreen image */}
      {fullImg && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullImg(null)}
        >
          <Image
            src={fullImg}
            alt=""
            width={800}
            height={800}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setFullImg(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Customer History Modal — all records for one customer
// ─────────────────────────────────────────────────────────────

function CustomerHistoryModal({ customerId, customerName, onClose }) {
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [selRec,   setSelRec]   = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // fetchServiceHistory with customer_id returns enriched records
      const data = await fetchServiceHistory(customerId);
      data.sort((a, b) => new Date(b.register_date) - new Date(a.register_date));
      setHistory(data);
    } catch (e) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { load(); }, [load]);

  const customerTotal = history.reduce((s, r) => s + parseFloat(r.total_bill || 0), 0);

  return (
    <>
      <Modal onClose={onClose} maxWidth="max-w-4xl">
        <ModalHeader
          title={`Service History — ${customerName}`}
          subtitle={loading ? "Loading…" : `${history.length} record${history.length !== 1 ? "s" : ""} · ₹${customerTotal.toLocaleString("en-IN")} total`}
          onClose={onClose}
        />

        <div className="p-6 space-y-4">

          {/* Refresh */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">All service visits for this customer</p>
            <button
              onClick={load}
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            </div>
          ) : error ? (
            <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-xl bg-red-50">
              <AlertCircle size={24} className="mx-auto text-red-400 mb-2" />
              <p className="text-red-600 text-sm font-semibold">{error}</p>
              <button onClick={load} className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold">
                Try Again
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <FileClock size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">No service records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead style={{ background: "#1e3a8a" }}>
                  <tr>
                    {["Date", "Bill", "Payment", "Reminder", "Parts",  "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((s, i) => {
                    const parts = Object.entries(s.spare_parts || {}).filter(([, v]) => v).map(([k]) => k);
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelRec(s)}
                        style={{ backgroundColor: i % 2 === 0 ? "white" : "#1e3a8a0d" }}
                        className="border-t border-slate-100 cursor-pointer hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: "#1e3a8a" }}>
                          {fmtDate(s.register_date)}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-700 whitespace-nowrap">
                          ₹{parseFloat(s.total_bill).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{s.payment_mode}</td>
                        <td className="px-4 py-3 text-slate-600">{s.reminder_months}M</td>
                        <td className="px-4 py-3">
                          {parts.length > 0 ? (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                              {parts.length} part{parts.length !== 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">None</span>
                          )}
                        </td>
                        {/* <td className="px-4 py-3 max-w-[180px]">
                          {s.notes
                            ? <p className="text-xs text-slate-400 truncate">{s.notes}</p>
                            : <span className="text-slate-300 text-xs">—</span>
                          }
                        </td> */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelRec(s); }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setToDelete({ id: s.id, date: fmtDate(s.register_date) }); }}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      {selRec && (
        <ServiceRecordModal
          record={selRec}
          onClose={() => setSelRec(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          const id = toDelete?.id;
          if (!id) return;
          setToDelete(null);
          await deleteServiceRecord(id);
          setHistory((prev) => prev.filter((r) => r.id !== id));
        }}
        title="Delete Service Record"
        message={`Permanently delete the service record for ${toDelete?.date}? This cannot be undone.`}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function ServiceHistoryPage() {
  const [allRecords, setAllRecords] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [month,      setMonth]      = useState(new Date().getMonth());
  const [year,       setYear]       = useState(currentYear);
  const [selRecord,  setSelRecord]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllServiceHistory({});
      setAllRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("[ServiceHistory] fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = allRecords.filter((r) => {
    const q = search.toLowerCase().trim();
    if (q && !r.customer_name?.toLowerCase().includes(q)) return false;
    const d = new Date(r.register_date);
    if (d.getMonth() !== month || d.getFullYear() !== year) return false;
    return true;
  });

  const totalBill = filtered.reduce((s, r) => s + parseFloat(r.total_bill || 0), 0);

  return (
    <>
      <PageHeader
        title="Service History"
        subtitle={`${filtered.length} record${filtered.length !== 1 ? "s" : ""} · ${MONTHS[month]} ${year}`}
        action={
          <button
            onClick={load}
            className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        }
      />

      {/* Search + Month + Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#1e3a8a" }} size={18} />
          <input
            type="text"
            placeholder="Search by customer name…"
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
            onChange={(e) => setMonth(+e.target.value)}
            className="w-full py-2.5 text-sm focus:outline-none bg-transparent text-slate-700 font-semibold"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>

        <div className="flex items-center bg-white border-2 rounded-lg px-3 shadow-sm" style={{ borderColor: "#1e3a8a33" }}>
          <select
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="w-full py-2.5 text-sm focus:outline-none bg-transparent text-slate-700 font-semibold"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}{y === currentYear ? " (This Year)" : ""}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table */}
      {loading ? (
        <PageSpinner />
      ) : (
        <div className="rounded-xl shadow-lg overflow-hidden bg-white">
          <div className="overflow-x-auto" style={{ maxHeight: 520 }}>
            <table className="w-full">
              <thead className="text-white sticky top-0 z-10" style={{ background: "#1e3a8a" }}>
                <tr>
                  {["Customer", "Date", "Payment", "Parts", "Reminder"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const parts = Object.entries(r.spare_parts || {}).filter(([, v]) => v).map(([k]) => k);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelRecord(r)}
                      className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/40 transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? "white" : "#1e3a8a0d" }}
                    >
                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex-shrink-0 flex items-center justify-center">
                            <span className="text-emerald-600 font-bold text-xs">
                              {r.customer_name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <p className="font-semibold text-sm" style={{ color: "#1e3a8a" }}>
                            {r.customer_name}
                          </p>
                        </div>
                      </td>
                    
                      {/* Date */}
                      <td className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap" style={{ color: "#1e3a8a" }}>
                        {fmtDate(r.register_date)}
                      </td>
                      {/* Bill */}
                      {/* <td className="px-4 py-3.5 text-sm font-black text-emerald-700 whitespace-nowrap">
                        ₹{parseFloat(r.total_bill).toLocaleString("en-IN")}
                      </td> */}
                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {r.payment_mode}
                        </span>
                      </td>
                      {/* Parts */}
                      <td className="px-4 py-3.5">
                        {parts.length > 0 ? (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                            {parts.length} part{parts.length !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">None</span>
                        )}
                      </td>
                      {/* Reminder */}
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {r.reminder_months}M
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <FileClock size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">No service records found</p>
              <p className="text-xs mt-1 text-slate-300">
                {search ? "Try adjusting your search" : `No records for ${MONTHS[month]} ${year}`}
              </p>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-600">{allRecords.length}</span> records
              </p>
              {/* <span className="text-xs font-bold text-emerald-600">
                ₹{totalBill.toLocaleString("en-IN")} total
              </span> */}
            </div>
          )}
        </div>
      )}

      {/* Row click → all records for that customer */}
      {selRecord && (
        <CustomerHistoryModal
          customerId={selRecord.customer_id}
          customerName={selRecord.customer_name}
          onClose={() => setSelRecord(null)}
        />
      )}
    </>
  );
}