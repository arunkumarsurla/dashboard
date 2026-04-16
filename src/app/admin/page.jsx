"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Users,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  UserPlus,
  FileText,
  Clock,
  MessageSquare,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";
import { getToken } from "@/utils/auth";

// ─── Fetch Function ──────────────────────────────────────────

const fetchDashboardStats = async () => {
  const res = await fetch("/api/dashboard", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  
  const json = await res.json();
  return json.data;
};

// ─── Stat Card — flat grey style matching old dashboard ──────

function StatCard({ title, value, icon: Icon, link }) {
  return (
    <Link href={link}>
      <div
        style={{ backgroundColor: "#1e3a8a1a" }}
        className="bg-slate-100 rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer border border-slate-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-4xl font-bold mt-2 text-slate-900">{value}</p>
          </div>
          <Icon size={48} className="text-slate-600" />
        </div>
      </div>
    </Link>
  );
}

// ─── Loading ─────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div
          className="spinner mx-auto mb-3"
          style={{ width: 36, height: 36, borderWidth: 4 }}
        />
        <p className="text-slate-400 text-sm">Loading dashboard…</p>
      </div>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium mb-2">Failed to load dashboard</p>
        <p className="text-slate-400 text-sm mb-4">{error.message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const {
    data: stats,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 2 minutes
    gcTime: 1000 * 60 * 10,    // 5 minutes (formerly cacheTime)
    retry: 2,
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isPending) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={handleRefresh} />;

  const s = stats ?? {};

  const statCards = [
    {
      title: "Total Customers",
      value: s.total ?? 0,
      icon: Users,
      link: "/admin/customers",
    },
    {
      title: "Total Service Customers",
      value: s.totalServiceCustomers ?? 0,
      icon: CheckCircle,
      link: "/admin/service-history",
    },
    {
      title: "Service Soon",
      value: s.expiringSoon ?? 0,
      icon: AlertTriangle,
      link: "/admin/service-soon",
    },
    {
      title: "Service Delay",
      value: s.expired ?? 0,
      icon: XCircle,
      link: "/admin/service-delay",
    },
    {
      title: "Open Complaints",
      value: s.pendingComplaints ?? 0,
      icon: Clock,
      link: "/admin/complaints",
    },
    {
      title: "Closed Complaints",
      value: s.resolvedComplaints ?? 0,
      icon: BadgeCheck,
      link: "/admin/complaints",
    },
  ];

  const quickActions = [
    {
      href: "/admin/add-customer",
      icon: UserPlus,
      label: "Add New Customer",
      className: "text-white",
      style: { background: "#1e3a8a" },
    },
    {
      href: "/admin/add-complaint",
      icon: MessageSquare,
      label: "Submit Complaint",
      className: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    {
      href: "/admin/new-services",
      icon: FileText,
      label: "Log New Service",
      className: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    {
      href: "/admin/service-soon",
      icon: AlertTriangle,
      label: "View Expiry Alerts",
      className: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    {
      href: "/admin/custom-invoice",
      icon: FileText,
      label: "Custom Invoice",
      className: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  ];

  const serviceSummary = [
    { label: "Total Customers", value: s.total ?? 0, color: "#1e3a8a" },
    {
      label: "Total Service Customers",
      value: s.totalServiceCustomers ?? 0,
      color: "#10b981",
    },
    {
      label: "Expiring Soon (7 days)",
      value: s.expiringSoon ?? 0,
      color: "#f59e0b",
    },
    { label: "Service Overdue", value: s.expired ?? 0, color: "#ef4444" },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back! Here is your overview.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-800 transition-colors"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stat cards — flat grey like old dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="rounded-xl shadow-sm p-6 bg-white border border-slate-200 max-w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map(
              ({ href, icon: Icon, label, className, style }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 w-full py-3 px-4 rounded-lg font-semibold text-sm shadow-sm transition-all hover:shadow-md ${className}`}
                  style={style}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Service Summary */}
        <div className="rounded-xl shadow-sm p-6 bg-white border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Service Summary
          </h2>

          <div className="space-y-3">
            {serviceSummary.map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
                <span className="font-bold text-slate-800 text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {(s.expiringSoon ?? 0) > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-amber-700 text-sm font-semibold">
                <Clock size={14} />
                {s.expiringSoon} service(s) expiring soon
              </div>
              <Link
                href="/admin/service-soon"
                className="text-xs text-amber-600 hover:underline mt-1 block"
              >
                View details →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}