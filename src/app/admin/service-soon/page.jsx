"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { fetchCustomers, updateCustomerStatus } from "@/services/customers";
import { getExpiryDate, daysFromToday, fmtDate } from "@/utils/dates";
import { PageHeader, PageSpinner, TableWrapper, THead } from "@/components/ui";
import { fetchSettings } from '@/services/settings'

// ─── Custom hook for settings ───────────────────────────────
function useSettings() {
  const [settings, setSettings] = useState({ whatsapp_message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Set default WhatsApp message if fetch fails
        setSettings({ 
          whatsapp_message: "Dear customer, your service is due soon. Please contact us to schedule your service appointment." 
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  return { settings, loading };
}

// ─── WhatsApp icon (lucide doesn't include it) ───────────────
function WhatsAppIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Build WhatsApp message with customer details ───────────
function buildWhatsAppMessage(settings, customer, expiryDate, daysLeft) {
  // Get the base message from settings
  let message = settings.whatsapp_message || "Dear customer, your service is due soon. Please contact us to schedule your service appointment.";
  
  // Replace placeholders with actual customer data
  const replacements = {
    '{name}': customer.name,
    '{phone}': customer.phone,
    '{area}': customer.area || '',
    '{plan}': `${customer.service} months`,
    '{expiry_date}': expiryDate ? fmtDate(expiryDate.toISOString()) : '—',
    '{days_left}': daysLeft === 0 ? 'today' : `${daysLeft} days`,
    '{customer_name}': customer.name,
    '{service_plan}': `${customer.service} months`,
    '{last_service}': customer.last_service_date ? fmtDate(customer.last_service_date) : '—',
  };
  
  // Replace all placeholders
  Object.keys(replacements).forEach(key => {
    message = message.replace(new RegExp(key, 'g'), replacements[key]);
  });
  
  return message;
}

function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
}

// ─── Table columns ────────────────────────────────────────────
const COLS = [
  { label: "Customer" },
  { label: "Phone" },
  { label: "Area", hidden: "hidden md:table-cell" },
  { label: "Plan" },
  { label: "Expires On" },
  { label: "Days Left" },
  { label: "Status" },
  { label: "Remind" },
];

export default function ServiceSoonPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings, loading: settingsLoading } = useSettings();

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
          const days = daysFromToday(c.last_service_date, c.service);
          return days >= 0 && days <= 7;
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

  if (loading || settingsLoading) return <PageSpinner />;

  return (
    <>
      <PageHeader
        title="Service Soon"
        subtitle={`${customers.length} customer${customers.length !== 1 ? "s" : ""} expiring within 7 days`}
      />

      {customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={38} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">All Clear!</h2>
          <p className="text-slate-400 text-sm">
            No services expiring within 7 days.
          </p>
        </div>
      ) : (
        <>
          {/* Info note */}
          <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
            <WhatsAppIcon size={14} />
            Click the green button on any row to send a WhatsApp reminder
            directly to the customer.
          </p>

          <div className="rounded-xl shadow-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className="text-white sticky top-0 z-10"
                  style={{ background: "#1e3a8a" }}
                >
                  <tr>
                    {COLS.map((col) => (
                      <th
                        key={col.label}
                        className={`px-4 py-3 text-left text-xs font-semibold whitespace-nowrap ${col.hidden ?? ""}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {customers.map((c, i) => {
                    const expiry = getExpiryDate(c.last_service_date, c.service);
                    const days = daysFromToday(c.last_service_date, c.service);
                    const whatsappMessage = buildWhatsAppMessage(settings, c, expiry, days);
                    const whatsappUrl = buildWhatsAppUrl(c.phone, whatsappMessage);

                    return (
                      <tr
                        key={c.id}
                        className="border-t border-slate-100"
                        style={{
                          backgroundColor: i % 2 === 0 ? "white" : "#fffbf0",
                        }}
                      >
                        {/* Name */}
                        <td
                          className="px-4 py-3.5 font-semibold text-sm"
                          style={{ color: "#1e3a8a" }}
                        >
                          {c.name}
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3.5 text-sm text-slate-600">
                          {c.phone}
                        </td>

                        {/* Area */}
                        <td className="px-4 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                          {c.area}
                        </td>

                        {/* Plan */}
                        <td className="px-4 py-3.5 text-sm text-slate-600">
                          {c.service}M
                        </td>

                        {/* Expires On */}
                        <td className="px-4 py-3.5 text-sm text-slate-600">
                          {expiry ? fmtDate(expiry.toISOString()) : "—"}
                        </td>

                        {/* Days Left */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`flex items-center gap-1 text-sm font-bold ${
                              days === 0 ? "text-red-500" : "text-amber-600"
                            }`}
                          >
                            <Clock size={13} />
                            {days === 0 ? "Today" : `${days}d`}
                          </span>
                        </td>

                        {/* Status dropdown */}
                        <td className="px-4 py-3.5">
                          <select
                            value={c.follow_up_status || "pending"}
                            onChange={(e) =>
                              handleStatusChange(c.id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${
                              c.follow_up_status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>

                        {/* WhatsApp remind button */}
                        <td className="px-4 py-3.5">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90"
                            style={{ background: "#25d366" }}
                            title={`Send WhatsApp reminder to ${c.name}`}
                          >
                            <WhatsAppIcon size={13} />
                            Remind
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}