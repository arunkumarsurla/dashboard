"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MapPin,
  Package,
  Loader2,
  Wrench,
  CheckCircle,
  AlertCircle,
  Edit2,
  X,
  RefreshCw,
  Settings,
  Save,
} from "lucide-react";

import { fetchSettings, updateSettings } from "@/services/settings";
import {
  fetchAreas,
  createArea,
  deleteArea,
  fetchBrands,
  createBrand,
  deleteBrand,
  fetchSpareParts,
  createSparePart,
  deleteSparePart,
} from "@/services/configurations";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { PageHeader, ErrorBanner } from "@/components/ui";

// ─────────────────────────────────────────────
// Reusable Section
// ─────────────────────────────────────────────

function ConfigSection({
  title,
  description,
  icon: Icon,
  iconBg,
  items,
  onAdd,
  onDelete,
  loading,
  adding,
  placeholder,
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleAdd = async () => {
    const val = input.trim();
    if (!val) {
      setError("Name cannot be empty");
      return;
    }

    if (items.some((item) => item.name.toLowerCase() === val.toLowerCase())) {
      setError("This item already exists");
      return;
    }

    setError("");

    try {
      await onAdd(val);
      setInput("");
      showSuccess(`${title.slice(0, -1)} added successfully`);
    } catch (e) {
      setError(e.message || "Failed to add");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-400 shadow-sm flex flex-col h-full transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-xl ${iconBg} shadow-sm`}
        >
          <Icon size={18} className="text-white" />
        </div>

        <div className="leading-tight flex-1">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <p className="text-xs text-slate-400">{description}</p>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Success Message */}
        {successMsg && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
            <CheckCircle size={14} />
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Input Section */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
            Add new {title.slice(0, -1).toLowerCase()}
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />

            <button
              onClick={handleAdd}
              disabled={adding || !input.trim()}
              className={`flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-lg ${iconBg} disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md`}
            >
              {adding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Plus size={14} /> Add
                </>
              )}
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="flex-1 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-400 rounded-xl">
              <Icon size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-400 font-medium">
                No {title.toLowerCase()} yet
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Add your first {title.slice(0, -1).toLowerCase()} above
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item, i) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2.5 group hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  {editingId === item.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          // Handle edit save here if needed
                          cancelEdit();
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-mono w-5">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1  group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setToDelete({ id: item.id, name: item.name })
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          const id = toDelete?.id;
          if (!id) return;
          setToDelete(null);
          await onDelete(id);
          showSuccess(`${title.slice(0, -1)} deleted successfully`);
        }}
        title={`Delete ${title.slice(0, -1)}`}
        message={`Are you sure you want to delete "${toDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Business Settings Component
// ─────────────────────────────────────────────

const SETTING_FIELDS = [
  {
    key: "company_name",
    label: "Company Name",
    placeholder: "e.g. MKL Enterprises",
    span: 1,
  },
  {
    key: "company_tagline",
    label: "Tagline",
    placeholder: "e.g. Sales & Service",
    span: 1,
  },
  {
    key: "company_phone",
    label: "Phone Number",
    placeholder: "Enter phone number…",
    span: 1,
  },
  {
    key: "company_email",
    label: "Email Address",
    placeholder: "e.g. admin@gmail.com",
    span: 1,
  },
  {
    key: "company_address",
    label: "Full Address",
    placeholder: "Enter full address…",
    span: 2,
  },
  {
    key: "whatsapp_message",
    label: "WhatsApp Reminder Message",
    placeholder: "Message sent to customers…",
    span: 2,
    multiline: true,
  },
];

function BusinessSettings({
  settings,
  onChange,
  onSave,
  saving,
  loading,
  error,
  success,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-400 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-sm">
          <Settings size={18} className="text-white" />
        </div>
        <div className="leading-tight flex-1">
          <h2 className="text-base font-bold text-slate-800">
            Business Settings
          </h2>
          <p className="text-xs text-slate-400">
            Used in invoices, PDFs & WhatsApp reminders
          </p>
        </div>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-slate-300" size={32} />
          </div>
        ) : (
          <>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {SETTING_FIELDS.map(
                ({ key, label, placeholder, span, multiline }) => (
                  <div
                    key={key}
                    className={span === 2 ? "sm:col-span-2" : ""}
                  >
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                      {label}
                    </label>
                    {multiline ? (
                      <textarea
                        rows={3}
                        value={settings[key] || ""}
                        onChange={(e) => onChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={settings[key] || ""}
                        onChange={(e) => onChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      />
                    )}
                  </div>
                ),
              )}
            </div>

            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 disabled:opacity-50 hover:shadow-md transition-all"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> Save Settings
                </>
              )}
            </button>
          </>
          
        )}
        {/* Success */}
            {success && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs mb-4">
                <CheckCircle size={14} /> Settings saved successfully
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs mb-4">
                <AlertCircle size={14} /> {error}
              </div>
            )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function ConfigurationsPage() {
  const [areas, setAreas] = useState([]);
  const [brands, setBrands] = useState([]);
  const [spareParts, setSpareParts] = useState([]);

  const [loadAreas, setLoadAreas] = useState(true);
  const [loadBrands, setLoadBrands] = useState(true);
  const [loadParts, setLoadParts] = useState(true);

  const [addingArea, setAddingArea] = useState(false);
  const [addingBrand, setAddingBrand] = useState(false);
  const [addingPart, setAddingPart] = useState(false);

  const [pageError, setPageError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState({});
  const [loadSettings, setLoadSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsOk, setSettingsOk] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoadAreas(true);
    setLoadBrands(true);
    setLoadParts(true);
    setLoadSettings(true);
    setPageError("");
    try {
      const [a, b, p, s] = await Promise.all([
        fetchAreas(),
        fetchBrands(),
        fetchSpareParts(),
        fetchSettings(),
      ]);
      setAreas(a || []);
      setBrands(b || []);
      setSpareParts(p || []);
      setSettings(s || {});
    } catch (err) {
      setPageError("Failed to load configurations. Please refresh the page.");
    } finally {
      setLoadAreas(false);
      setLoadBrands(false);
      setLoadParts(false);
      setLoadSettings(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  // Sort helper
  const sortByName = (arr) =>
    [...arr].sort((a, b) => a.name.localeCompare(b.name));

  // Areas
  const handleAddArea = async (name) => {
    setAddingArea(true);
    try {
      const item = await createArea(name);
      setAreas((prev) => sortByName([...prev, item]));
    } finally {
      setAddingArea(false);
    }
  };

  const handleDeleteArea = async (id) => {
    await deleteArea(id);
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  // Brands
  const handleAddBrand = async (name) => {
    setAddingBrand(true);
    try {
      const item = await createBrand(name);
      setBrands((prev) => sortByName([...prev, item]));
    } finally {
      setAddingBrand(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    await deleteBrand(id);
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  // Spare Parts
  const handleAddPart = async (name) => {
    setAddingPart(true);
    try {
      const item = await createSparePart(name);
      setSpareParts((prev) => sortByName([...prev, item]));
    } finally {
      setAddingPart(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsError("");
    setSettingsOk(false);
    try {
      await updateSettings(settings);
      setSettingsOk(true);
      setTimeout(() => setSettingsOk(false), 3000);
    } catch (e) {
      setSettingsError(e.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeletePart = async (id) => {
    await deleteSparePart(id);
    setSpareParts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Settings & Configurations"
          subtitle="Manage company details, areas, brands, and spare parts"
        />
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-400 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <ErrorBanner message={pageError} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="md:col-span-2 xl:col-span-3">
          <BusinessSettings
            settings={settings}
            onChange={handleSettingChange}
            onSave={handleSaveSettings}
            saving={savingSettings}
            loading={loadSettings}
            error={settingsError}
            success={settingsOk}
          />
        </div>
        <ConfigSection
          title="Areas"
          description="Service areas & locations"
          icon={MapPin}
          iconBg="bg-gradient-to-br from-blue-600 to-blue-700"
          items={areas}
          onAdd={handleAddArea}
          onDelete={handleDeleteArea}
          loading={loadAreas}
          adding={addingArea}
          placeholder="e.g. Vizag, Hyderabad"
        />

        <ConfigSection
          title="Brands"
          description="Water purifier brands"
          icon={Package}
          iconBg="bg-gradient-to-br from-violet-600 to-violet-700"
          items={brands}
          onAdd={handleAddBrand}
          onDelete={handleDeleteBrand}
          loading={loadBrands}
          adding={addingBrand}
          placeholder="e.g. Kent, Aquaguard"
        />

        <ConfigSection
          title="Spare Parts"
          description="Replacement parts & components"
          icon={Wrench}
          iconBg="bg-gradient-to-br from-emerald-600 to-emerald-700"
          items={spareParts}
          onAdd={handleAddPart}
          onDelete={handleDeletePart}
          loading={loadParts}
          adding={addingPart}
          placeholder="e.g. Membrane, Filter"
        />
        
        
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700 flex items-center gap-2">
          <AlertCircle size={14} />
          Changes made here will reflect across all modules instantly. Deleted
          items cannot be recovered.
        </p>
      </div>
    </div>
  );
}