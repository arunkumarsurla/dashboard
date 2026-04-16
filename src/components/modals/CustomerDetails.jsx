"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  Calendar,
  Edit2,
  Download,
  ChevronRight,
} from "lucide-react";
import { updateCustomer } from "@/services/customers";
import { getExpiryDate } from "@/utils/dates";
import { fetchAreas, fetchBrands } from "@/services/configurations";
import { REMINDER_OPTIONS } from "@/utils/constants";
import { inputCls, textareaCls, selectCls } from "@/components/ui";

function Field({
  icon: Icon,
  label,
  name,
  type = "text",
  editing,
  value,
  onChange,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-blue-800" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        {editing && name ? (
          type === "textarea" ? (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              rows={2}
              className={textareaCls}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              className={inputCls}
            />
          )
        ) : (
          <p className="font-semibold text-slate-800 text-sm break-words">
            {value || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CustomerDetails({ customer, onClose, onUpdate }) {
  const [areas, setAreas] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showPics, setShowPics] = useState(false);
  const [fullImg, setFullImg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: customer.name || "",
    phone: customer.phone || "",
    email: customer.email || "",
    address: customer.address || "",
    area: customer.area || "",
    brand: customer.brand || "",
    service: customer.service || "",
  });

  useEffect(() => {
    let mounted = true;

    const loadConfigs = async () => {
      try {
        const [a, b] = await Promise.all([fetchAreas(), fetchBrands()]);

        if (!mounted) return;

        // ✅ convert to array of names
        const areaNames = (a || []).map((i) => i?.name).filter(Boolean);
        const brandNames = (b || []).map((i) => i?.name).filter(Boolean);

        setAreas(areaNames);
        setBrands(brandNames);
      } catch (err) {
        console.error("Failed to load configs", err);
      }
    };

    loadConfigs();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }
    setSaving(true);
    try {
      await updateCustomer(customer.id, form);
      setEditing(false);
      onUpdate?.();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const expireDate = getExpiryDate(
    customer.last_service_date,
    customer.service,
  );
  const isExpired = expireDate < new Date();
  const fmtExpire = expireDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fadeIn"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="p-5 flex justify-between items-center rounded-t-2xl"
            style={{ background: "#1e3a8a" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {editing ? "Edit Customer" : "Customer Profile"}
                </h2>
                <p className="text-blue-200 text-xs">
                  #{customer.id?.slice(-6)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition-all"
                >
                  <Edit2 size={17} />
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition-all"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="p-5">
            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-4 border-blue-100 overflow-hidden bg-blue-50 shadow-md">
                  {customer.profile_pic ? (
                    <img
                      src={customer.profile_pic}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-300 font-black text-3xl">
                      {customer.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${isExpired ? "bg-red-500" : "bg-emerald-500"}`}
                />
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field
                icon={User}
                label="Customer Name"
                name="name"
                editing={editing}
                value={form.name}
                onChange={onChange}
              />
              <Field
                icon={Phone}
                label="Phone Number"
                name="phone"
                editing={editing}
                value={form.phone}
                onChange={onChange}
              />
              <Field
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                editing={editing}
                value={form.email}
                onChange={onChange}
              />
              <Field
                icon={Package}
                label="Area"
                name={null}
                editing={false}
                value={customer.area}
              />

              {/* Area select when editing */}
              {editing && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package size={15} className="text-blue-800" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">Area</p>
                    <select
                      name="area"
                      value={form.area}
                      onChange={onChange}
                      className={selectCls}
                    >
                      {areas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <Field
                icon={Package}
                label="Brand"
                name={null}
                editing={false}
                value={customer.brand}
              />
              {editing && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package size={15} className="text-blue-800" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-0.5">Brand</p>
                    <select
                      name="brand"
                      value={form.brand}
                      onChange={onChange}
                      className={selectCls}
                    >
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Service plan */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package size={15} className="text-blue-800" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-0.5">Service Plan</p>
                  {editing ? (
                    <select
                      name="service"
                      value={form.service}
                      onChange={onChange}
                      className={selectCls}
                    >
                      {REMINDER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800 text-sm">
                      {customer.service} Months
                    </p>
                  )}
                </div>
              </div>

              {/* Service date */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar size={15} className="text-blue-800" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Register Date</p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {customer.register_date
                      ? new Date(customer.register_date).toLocaleDateString(
                          "en-GB",
                        )
                      : new Date(customer.created_at).toLocaleDateString(
                          "en-GB",
                        )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar size={15} className="text-blue-800" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">
                    Last Service Date
                  </p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {customer.last_service_date
                      ? new Date(customer.last_service_date).toLocaleDateString(
                          "en-GB",
                        )
                      : new Date(customer.created_at).toLocaleDateString(
                          "en-GB",
                        )}
                  </p>
                </div>
              </div>

              {/* Expire date */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar
                    size={15}
                    className={isExpired ? "text-red-500" : "text-emerald-600"}
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Expire Date</p>
                  <p
                    className={`font-semibold text-sm ${isExpired ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {fmtExpire}
                    {isExpired && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Expired
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <Field
              icon={MapPin}
              label="Address"
              name="address"
              type="textarea"
              editing={editing}
              value={form.address}
              onChange={onChange}
            />

            {/* Additional pics */}
            {customer.additional_pics?.length > 0 && (
              <button
                onClick={() => setShowPics(true)}
                className="mt-4 w-full flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-blue-800" />
                  <span className="text-sm font-semibold text-blue-900">
                    Additional Pictures
                  </span>
                  <span className="bg-blue-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {customer.additional_pics.length}
                  </span>
                </div>
                <ChevronRight size={15} className="text-blue-400" />
              </button>
            )}

            {editing && (
              <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 text-white rounded-xl font-semibold text-sm shadow-md flex items-center gap-2 transition-all disabled:opacity-60"
                  style={{ background: "#1e3a8a" }}
                >
                  {saving && (
                    <div
                      className="spinner"
                      style={{ width: 14, height: 14, borderWidth: 2 }}
                    />
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pics grid modal */}
      {showPics && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setShowPics(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-5 flex justify-between items-center rounded-t-2xl"
              style={{ background: "#1e3a8a" }}
            >
              <h2 className="font-bold text-white">
                Additional Pictures ({customer.additional_pics.length})
              </h2>
              <button
                onClick={() => setShowPics(false)}
                className="bg-white/20 p-2 rounded-lg text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {customer.additional_pics.map((pic, i) => (
                <div
                  key={i}
                  onClick={() => setFullImg(pic)}
                  className="relative group rounded-xl overflow-hidden border-2 border-slate-100 cursor-pointer hover:border-blue-300 transition-all"
                >
                  <img src={pic} alt="" className="w-full h-36 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-lg">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image */}
      {fullImg && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullImg(null)}
        >
          <img
            src={fullImg}
            alt=""
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <a
              href={fullImg}
              download={`customer-${Date.now()}.jpg`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all"
            >
              <Download size={19} />
            </a>
            <button
              onClick={() => setFullImg(null)}
              className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all"
            >
              <X size={19} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
