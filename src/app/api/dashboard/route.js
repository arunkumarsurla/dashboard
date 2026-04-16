import { getServiceClient } from "@/lib/supabase";
import { ok, serverErr } from "@/utils/api-response";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Parse "YYYY-MM-DD" or ISO timestamp → local midnight Date (no UTC shift) */
function parseLocalDate(raw) {
  if (!raw) return null;
  const datePart = String(raw).slice(0, 10); // "YYYY-MM-DD"
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d); // local midnight
}

/** Days between today (local midnight) and the service expiry date */
function daysUntilExpiry(lastServiceDateRaw, createdAtRaw, months) {
  const start =
    parseLocalDate(lastServiceDateRaw) ??
    parseLocalDate(createdAtRaw) ??
    new Date();
  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + months);
  expiry.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.floor((expiry - today) / 86_400_000);
}

/** Check whether a customer was created in the current calendar month */
function isCurrentMonth(createdAt) {
  const d = new Date(createdAt);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
}

// ─── route ──────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const supabase = getServiceClient();

    // Fetch only the columns we need
    const { data: customers, error: custError } = await supabase
      .from("customers")
      .select("id, service, last_service_date, follow_up_status, created_at")
      .eq("is_deleted", false);

    if (custError) throw custError;

    // Fetch complaint statuses in parallel
    const { data: complaints, error: compError } = await supabase
      .from("complaints")
      .select("status");

    if (compError) throw compError;

const { data, error } = await supabase
  .from("service_records")
  .select("customer_id");

if (error) throw error;

// ✅ reliable unique count
const totalServiceCustomers = new Set(
  (data || []).map((r) => r.customer_id)
).size;

    // ── compute customer stats ──────────────────────────────────────
    let expiringSoon = 0;
    let expired = 0;
    let currentMonthCount = 0;

    for (const c of customers) {
      const months = parseInt(c.service || 0);

      // Count new customers this month
      if (isCurrentMonth(c.created_at)) currentMonthCount++;

      // Skip expiry check when no plan or already marked completed
      if (months === 0 || c.follow_up_status === "completed") continue;

      // Use last_service_date column, fall back to created_at
      const days = daysUntilExpiry(c.last_service_date, c.created_at, months);

      if (days < 0) expired++;
      else if (days <= 7) expiringSoon++;
    }

    // ── compute complaint stats ─────────────────────────────────────
    const pendingComplaints = complaints.filter(
      (c) => c.status === "pending",
    ).length;
    const resolvedComplaints = complaints.filter(
      (c) => c.status === "resolved",
    ).length;

    return ok({
      total: customers.length,           // total customers from customers table
      totalServiceCustomers: totalServiceCustomers,     // total service customers from service_records table
      expiringSoon,
      expired,
      currentMonthCount,
      pendingComplaints,
      resolvedComplaints,
    });
  } catch (e) {
    return serverErr(e);
  }
}