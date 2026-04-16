"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  AlertTriangle,
  Trash2,
  Menu,
  X,
  LogOut,
  FileText,
  MessageSquare,
  ChevronLeft,
  Clock,
  Calendar,
  Settings,
  History,
  FileClock
} from "lucide-react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { removeToken, getToken } from "@/utils/auth";
import Image from "next/image";

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/add-customer", icon: UserPlus, label: "Add Customer" },

  { path: "/admin/customers", icon: Users, label: "All Customers" },
  {
    path: "/admin/current-month-customers",
    icon: Calendar,
    label: "Monthly View",
  },
  { path: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
  { path: "/admin/new-services", icon: FileText, label: "New Services" },
  { path: "/admin/service-history", icon: FileClock, label: "Service History" },
  { path: "/admin/service-soon", icon: Clock, label: "Service Soon" },
  { path: "/admin/service-delay", icon: AlertTriangle, label: "Service Delay" },

  { path: "/admin/custom-invoice", icon: FileText, label: "Custom Invoice" },
  { path: "/admin/bin", icon: Trash2, label: "Bin" },
  {
    path: "/admin/configurations",
    icon: Settings,
    label: "Settings",
  },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const isActive = (path) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  const pageLabel =
    menuItems.find((m) => isActive(m.path))?.label || "Admin Panel";

  const NavLink = ({ path, icon: Icon, label, onClick, divider }) => {
    const active = isActive(path);
    return (
      <>
        {divider && (sidebarOpen || onClick) && (
          <div className="my-1 border-t border-blue-800/30" />
        )}
        <Link
          href={path}
          onClick={onClick}
          title={!sidebarOpen && !onClick ? label : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
            ${
              active
                ? "bg-white text-blue-900 shadow-md font-bold"
                : "text-white hover:bg-white/10 hover:text-white"
            }`}
        >
          <Icon
            size={19}
            className={
              active
                ? "text-blue-800"
                : "text-white group-hover:text-white transition-colors"
            }
          />
          {(sidebarOpen || onClick) && (
            <span className="text-sm truncate">{label}</span>
          )}
          {sidebarOpen && active && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </Link>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 sidebar-transition ${sidebarOpen ? "sidebar-w-open" : "sidebar-w-close"}`}
        style={{ background: "#1E3A8A" }}
      >
        {/* Logo row */}
        <div
          className={`flex items-center border-b border-blue-800/50 p-4 ${sidebarOpen ? "justify-between" : "justify-center"}`}
        >
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div>
                <Image
                  src="/mkl_logo.jpeg"
                  width={70}
                  height={0}
                  style={{ height: "auto" }}
                  alt="logo"
                />{" "}
              </div>
              <div>
                <p className="text-white font-black leading-none">
                  Admin Dashboard
                </p>
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto space-y-0.5">
          {menuItems.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-800/40">
          <button
            onClick={() => setShowLogout(true)}
            className={`w-full flex items-center ${sidebarOpen ? "gap-2.5 justify-start px-3" : "justify-center"} py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-all shadow-md`}
          >
            <LogOut size={17} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 h-full w-72 flex flex-col animate-slideInLeft"
            style={{ background: "#1E3A8A" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-blue-800/50">
              <div className="flex items-center gap-2.5">
                <div>
                  <Image
                    src="/mkl_logo.jpeg"
                    width={30}
                    height={30}
                    alt="logo"
                  />
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-none">
                    MKL Admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white hover:text-white p-1.5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  {...item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="p-3 border-t border-blue-800/40">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setShowLogout(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-all"
              >
                <LogOut size={17} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu size={21} />
            </button>
            <div>
              <h1 className="font-extrabold text-slate-800 text-base leading-none">
                MKL Water Purifier Admin
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                {pageLabel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Admin Online
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 animate-fadeIn overflow-y-auto">
          {children}
        </div>
      </main>

      <ConfirmModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to sign out of the admin panel?"
      />
    </div>
  );
}
