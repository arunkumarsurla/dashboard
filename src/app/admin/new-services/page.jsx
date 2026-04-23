"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  Save,
  Download,
  Plus,
  Trash2,
  Users,
  AlertCircle,
  RefreshCw,
  Eye,
  FileClock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { fetchCustomers, fetchServiceHistory } from "@/services/customers";
import { createServiceRecord } from "@/services/records";
import { fetchAreas, fetchSpareParts } from "@/services/configurations";
import { uploadMultiple, compressImage } from "@/lib/cloudinary";
import { generateServiceInvoice } from "@/utils/pdf";
import {
  daysFromToday,
  getExpiryDate,
  fmtDate,
  formatDateTime
} from "@/utils/dates";
import { REMINDER_OPTIONS, PAYMENT_MODES } from "@/utils/constants";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { PageHeader, PageSpinner } from "@/components/ui";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const createBlankForm = (parts = []) => ({
  spare_parts: Object.fromEntries(parts.map((p) => [p, false])),
  imagePreviews: [],
  total_bill: "",
  payment_mode: "UPI",
  register_date: new Date().toISOString().split("T")[0],
  reminder_months: "3",
  notes: "",
});

function statusColor(days) {
  if (days === 9999) return "text-slate-500";
  if (days < 0) return "text-red-600";
  if (days <= 7) return "text-amber-600";
  return "text-emerald-600";
}

function statusLabel(days) {
  if (days === 9999) return "No plan";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  return `${days}d left`;
}

// ─────────────────────────────────────────────────────────────
// Modal wrapper
// ─────────────────────────────────────────────────────────────

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
// Service History Modal
// ─────────────────────────────────────────────────────────────

function ServiceHistoryModal({ customer, onClose, onAddNew }) {
  const [spareParts, setSpareParts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selRec, setSelRec] = useState(null);
  const [yearFilter, setYearFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchServiceHistory(customer.id);
      setHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [customer.id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchSpareParts();

        if (!mounted) return;

        const names = (data || []).map((i) => i?.name).filter(Boolean);

        setSpareParts(names);
      } catch (err) {
        console.error("Failed to load spare parts", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const years = [
    ...new Set(history.map((s) => new Date(s.register_date).getFullYear())),
  ].sort((a, b) => b - a);

  const filtered = yearFilter
    ? history.filter(
        (s) =>
          new Date(s.register_date).getFullYear().toString() === yearFilter,
      )
    : history;

  const expiryDate =
    customer.service > 0
      ? fmtDate(
          getExpiryDate(customer.register_date, customer.service)
            .toISOString()
            .split("T")[0],
        )
      : null;

  const days = daysFromToday(customer.register_date, customer.service);

  return (
    <>
      <Modal onClose={onClose}>
        <ModalHeader
          title={`Service History — ${customer.name}`}
          subtitle={`${customer.brand} · ${customer.area} · ${customer.phone}`}
          onClose={onClose}
        />

        <div className="p-6 space-y-5">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <button
                onClick={load}
                className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
            </div>
            <button
              onClick={onAddNew}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-semibold text-sm transition-colors hover:opacity-90"
              style={{ background: "#1e3a8a" }}
            >
              <Plus size={16} /> Add New Service
            </button>
          </div>

          {/* History list */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div
                className="spinner"
                style={{ width: 28, height: 28, borderWidth: 3 }}
              />
            </div>
          ) : error ? (
            <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-xl bg-red-50">
              <AlertCircle size={24} className="mx-auto text-red-400 mb-2" />
              <p className="text-red-600 text-sm font-semibold">{error}</p>
              <button
                onClick={load}
                className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold"
              >
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <FileClock size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">
                {yearFilter
                  ? `No services in ${yearFilter}`
                  : "No service records yet"}
              </p>
              <p className="text-slate-300 text-xs mt-1">
                Click &quot;Add New Service&quot; above
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead style={{ background: "#1e3a8a" }}>
                  <tr>
                    {["Date", "Bill", "Payment", "Reminder", "Parts"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-white"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((s, i) => {
                    const parts = Object.entries(s.spare_parts || {})
                      .filter(([, v]) => v)
                      .map(([k]) => k);

                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelRec(s)}
                        style={{
                          backgroundColor: i % 2 === 0 ? "white" : "#f8faff",
                        }}
                        className="border-t border-slate-100 cursor-pointer hover:bg-blue-50 transition"
                      >
                        <td
                          className="px-4 py-3 font-semibold"
                          style={{ color: "#1e3a8a" }}
                        >
                          {fmtDate(s.register_date)}
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          ₹{s.total_bill}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {s.payment_mode}
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {s.reminder_months}M
                        </td>

                        <td className="px-4 py-3 text-slate-600">
                          {parts.length > 0 ? (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                              {parts.length} part{parts.length !== 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">None</span>
                          )}
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

      {/* View record modal */}
      {selRec && (
        <ServiceRecordModal
          record={selRec}
          customer={customer}
          onClose={() => setSelRec(null)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// View Single Service Record Modal
// ─────────────────────────────────────────────────────────────

function ServiceRecordModal({ record, customer, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [fullImg, setFullImg] = useState(null);

  const parts = Object.entries(record.spare_parts || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateServiceInvoice({
        customer,
        serviceDate: record.register_date,
        savedData: {
          reminderMonths: record.reminder_months,
          totalBill: record.total_bill,
          paymentMode: record.payment_mode,
          spareParts: record.spare_parts, 

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
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bill Amount", value: `₹${record.total_bill}` },
              { label: "Payment", value: record.payment_mode },
              { label: "Next In", value: `${record.reminder_months}M` },
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
            <p className="font-bold text-blue-900 text-sm mb-2">
              Spare Parts Replaced
            </p>
            {parts.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {parts.map((p) => (
                  <span
                    key={p}
                    className="text-sm text-slate-700 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                No parts replaced this visit
              </p>
            )}
          </div>

          {/* Notes */}
          {record.notes && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-bold text-slate-700 text-sm mb-1">Notes</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {record.notes}
              </p>
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

          {/* Download */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {downloading ? (
                <div
                  className="spinner"
                  style={{ width: 14, height: 14, borderWidth: 2 }}
                />
              ) : (
                <Download size={15} />
              )}
              Download Invoice
            </button>
          </div>
        </div>
      </Modal>

      {/* Full screen image */}
      {fullImg && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
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
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Add New Service Modal
// ─────────────────────────────────────────────────────────────

function AddServiceModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState(createBlankForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [spareParts, setSpareParts] = useState([]);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchSpareParts();

        if (!mounted) return;

        const names = (data || []).map((i) => i?.name).filter(Boolean);

        setSpareParts(names);

        // initialize form properly
        setForm(createBlankForm(names));
      } catch (err) {
        console.error("Failed to load spare parts", err);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleImages = async (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      5 - form.imagePreviews.length,
    );
    for (const f of files) {
      const c = await compressImage(f, 800, 0.7);
      setForm((p) => ({ ...p, imagePreviews: [...p.imagePreviews, c] }));
    }
  };

  const handleSave = async () => {
    setError("");
    if (!form.total_bill) {
      setError("Bill amount is required");
      return;
    }
    setSaving(true);
    try {
      let imageUrls = [];
      if (form.imagePreviews.length > 0)
        imageUrls = await uploadMultiple(
          form.imagePreviews,
          "ak-admin/services",
        );

      const record = await createServiceRecord({
        customer_id: customer.id,
        customer_name: customer.name,
        register_date: form.register_date,
        spare_parts: form.spare_parts,
        images: imageUrls,
        total_bill: form.total_bill,
        payment_mode: form.payment_mode,
        reminder_months: parseInt(form.reminder_months),
        notes: form.notes,
      });
      onSaved(record);
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const selectedParts = Object.values(form.spare_parts).filter(Boolean).length;

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Add New Service"
        subtitle={`${customer.name} · ${customer.brand} · ${customer.area}`}
        onClose={onClose}
      />

      <div className="p-6 space-y-5">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Spare Parts */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
          <p className="font-bold text-blue-900 mb-3 text-sm">
            Spare Parts Replaced
            {selectedParts > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                {selectedParts} selected
              </span>
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {spareParts.map((p) => (
              <label key={p} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.spare_parts[p]}
                  onChange={() =>
                    set("spare_parts", {
                      ...form.spare_parts,
                      [p]: !form.spare_parts[p],
                    })
                  }
                  className="w-4 h-4 rounded accent-blue-700"
                />
                <span className="text-sm text-gray-700">{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date + Reminder */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100 space-y-3">
          <p className="font-bold text-blue-900 text-sm">
            Service Date & Reminder
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Service Date
              </label>
              <input
                type="date"
                value={form.register_date}
                onChange={(e) => set("register_date", e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Next Reminder
              </label>
              <select
                value={form.reminder_months}
                onChange={(e) => set("reminder_months", e.target.value)}
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                {REMINDER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
          <p className="font-bold text-blue-900 text-sm mb-2">
            Upload Photos ({form.imagePreviews.length}/5)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={form.imagePreviews.length >= 5}
            onChange={handleImages}
            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm text-slate-500 bg-white"
          />
          {form.imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {form.imagePreviews.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden border border-blue-200"
                >
                  <Image
                    src={img}
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-16 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "imagePreviews",
                        form.imagePreviews.filter((_, j) => j !== i),
                      )
                    }
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100 space-y-3">
          <p className="font-bold text-blue-900 text-sm">Billing Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Total Bill (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.total_bill}
                onChange={(e) => set("total_bill", e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Payment Mode
              </label>
              <div className="flex gap-4 mt-2">
                {PAYMENT_MODES.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={m}
                      checked={form.payment_mode === m}
                      onChange={() => set("payment_mode", m)}
                      className="w-4 h-4 accent-blue-700"
                    />
                    <span className="text-sm text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any notes about this service visit…"
            className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={saving || !form.total_bill}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-white font-bold text-sm rounded-lg disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: "#1e3a8a" }}
          >
            {saving ? (
              <>
                <div
                  className="spinner"
                  style={{ width: 14, height: 14, borderWidth: 2 }}
                />{" "}
                Saving…
              </>
            ) : (
              <>
                <Save size={16} /> Save Service Record
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// Pagination Component
// ─────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  const pageSizeOptions = [10, 25, 50, 100];
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-50 border-t border-slate-200">
      {/* Page size selector */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 bg-white"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>entries</span>
        <span className="text-slate-400 hidden sm:inline">
          (Showing {startItem} to {endItem} of {totalItems})
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? "bg-blue-900 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function NewServicesPage() {
  const [customers, setCustomers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selCust, setSelCust] = useState(null);
  const [addFor, setAddFor] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const [c, a] = await Promise.all([
        fetchCustomers().catch(() => []),
        fetchAreas().catch(() => []),
      ]);
      setCustomers(c);
      setAreas(a);
    } finally {
      setLoading(false);
    }
  };

  // Filter customers
  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      return (
        (c.name.toLowerCase().includes(q) || c.phone.includes(q)) &&
        (!areaFilter || c.area === areaFilter)
      );
    });
  }, [customers, search, areaFilter]);

  // Paginate customers
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Reset to first page when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, areaFilter, pageSize]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // After saving a new record → refresh customer list + reopen history for same customer
  const handleSaved = async (record) => {
    setAddFor(null);
    const fresh = await fetchCustomers().catch(() => customers);
    setCustomers(fresh);
    const updated = fresh.find((c) => c.id === selCust?.id);
    if (updated) setSelCust(updated);
  };

  const tableHeaders = [
    "Name",
    "Phone",
    "Area",
    "Brand",
    "Plan",
    "Last Service Date",
    "Expire Date",
  ];

  return (
    <>
      <PageHeader
        title="New Services"
        subtitle="Search customers and manage service history"
      />

      {/* Search + area filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#1e3a8a" }}
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or phone number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 rounded-lg text-sm focus:outline-none focus:ring-2 shadow-sm"
            style={{ borderColor: "#1e3a8a33" }}
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border-2 rounded-lg text-sm focus:outline-none focus:ring-2 shadow-sm"
          style={{ borderColor: "#1e3a8a33" }}
        >
          <option value="">All Areas</option>
          {areas.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table with Pagination */}
      {loading ? (
        <PageSpinner />
      ) : (
        <div className="rounded-xl shadow-lg overflow-hidden bg-white">
          <div className="overflow-x-auto" style={{ maxHeight: 600 }}>
            <table className="w-full">
              <thead
                className="text-white sticky top-0 z-10"
                style={{ background: "#1e3a8a" }}
              >
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((c, i) => {
                  const days = daysFromToday(c.last_service_date, c.service);
                  const expiry =
                    c.service > 0 && c.last_service_date
                      ? getExpiryDate(c.last_service_date, c.service)
                      : null;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelCust(c)}
                      className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/40 transition-colors"
                      style={{
                        backgroundColor: i % 2 === 0 ? "white" : "#1e3a8a0d",
                      }}
                    >
                      <td
                        className="px-4 py-3.5 text-sm font-semibold"
                        style={{ color: "#1e3a8a" }}
                      >
                        {c.name}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {c.phone}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {c.area}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {c.brand}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {c.service ? `${c.service}M` : "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 text-sm font-semibold"
                        style={{ color: "#1e3a8a" }}
                      >
                        {c.last_service_date
                          ? fmtDate(c.last_service_date)
                          : "—"}
                      </td>
                      <td
                        className="px-4 py-3.5 text-sm font-semibold"
                        style={{ color: days < 0 ? "#ef4444" : "#10b981" }}
                      >
                        {expiry
                          ? fmtDate(expiry.toISOString().split("T")[0])
                          : "—"}
                        {days < 0 && (
                          <span className="ml-1.5 text-xs text-red-400">
                            ({Math.abs(days)}d delay)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filtered.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Users size={28} className="mx-auto mb-2 text-slate-300" />
              No customers found
            </div>
          )}
        </div>
      )}

      {/* History modal */}
      {selCust && !addFor && (
        <ServiceHistoryModal
          customer={selCust}
          onClose={() => setSelCust(null)}
          onAddNew={() => setAddFor(selCust)}
        />
      )}

      {/* Add service modal */}
      {addFor && (
        <AddServiceModal
          customer={addFor}
          onClose={() => setAddFor(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
