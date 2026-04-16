/**
 * Parse any date value from Supabase safely as LOCAL date.
 * Supabase returns:
 *   - DATE columns  → "2024-03-15"  (plain string, no time)
 *   - TIMESTAMPTZ   → "2024-03-15T00:00:00+00:00" or "2024-03-15T18:30:00+00:00"
 *
 * Using new Date("2024-03-15") gives midnight UTC = day before in IST (+5:30).
 * We always split and build a LOCAL date to avoid timezone drift.
 */
export function parseSupabaseDate(raw) {
  if (!raw) return null;
  // Strip time portion — take only YYYY-MM-DD part
  const datePart =
    typeof raw === "string" && raw.includes("T")
      ? raw.split("T")[0]
      : String(raw).slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // local midnight, no UTC shift
}

// Legacy alias used elsewhere in the codebase
export const parseLocalDate = parseSupabaseDate;

/**
 * Format any Supabase date string to dd/mm/yyyy safely.
 */
export function fmtDate(raw) {
  if (!raw) return "—";
  const d = parseSupabaseDate(raw);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format with month name: "15 Mar 2024"
 */
export function fmtDateLong(raw) {
  if (!raw) return "—";
  const d = parseSupabaseDate(raw);
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns the expiry Date given a service start date and month count.
 */
export function getExpiryDate(serviceDateRaw, months) {
  const monthsInt = parseInt(months || 0);
  const start = serviceDateRaw ? parseSupabaseDate(serviceDateRaw) : new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + monthsInt);
  return end;
}

/**
 * Days until expiry (positive = future, negative = overdue).
 * Returns a large positive number if no service months set (never expires).
 */
export function daysFromToday(serviceDateRaw, months) {
  const monthsInt = parseInt(months || 0);
  if (!monthsInt) return 9999; // no plan = treat as never expiring
  const expiry = getExpiryDate(serviceDateRaw, monthsInt);
  expiry.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((expiry - today) / 86_400_000);
}

/**
 * Returns 'active' | 'soon' | 'expired' for a customer row.
 */
export function getServiceStatus(customer) {
  const months = parseInt(customer.service || 0);
  if (!months) return "active";
  const days = daysFromToday(customer.last_service_date, months);
  if (days < 0) return "expired";
  if (days <= 7) return "soon";
  return "active";
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  });
}