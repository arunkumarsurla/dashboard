"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Download,
  Upload,
  User,
  Calendar,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Building,
  Bell,
  Image,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { createCustomer } from "@/services/customers";
import { fetchAreas, fetchBrands } from "@/services/configurations";
import {
  uploadToCloudinary,
  uploadMultiple,
  compressImage,
} from "@/lib/cloudinary";
import { generateServiceInvoice } from "@/utils/pdf";
import { REMINDER_OPTIONS } from "@/utils/constants";
import {
  PageHeader,
  ErrorBanner,
  FormField,
  inputCls,
  selectCls,
  textareaCls,
} from "@/components/ui";

export default function AddCustomerPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [extraPics, setExtraPics] = useState([]);
  const [extraPicsPreviews, setExtraPicsPreviews] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [areas, setAreas] = useState([]);
  const [brands, setBrands] = useState([]);
  const [configLoading, setConfigLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    brand: "",
    service: "",
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [a, b] = await Promise.all([fetchAreas(), fetchBrands()]);
        setAreas(a || []);
        setBrands(b || []);
      } catch (err) {
        console.error("Failed to load configurations:", err);
        setError("Failed to load areas and brands. Please refresh the page.");
      } finally {
        setConfigLoading(false);
      }
    };
    loadConfig();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((p) => ({ ...p, phone: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be less than 5MB");
      return;
    }
    
    const compressed = await compressImage(file, 400, 0.7);
    setProfilePic(compressed);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    if (profilePicPreview) {
      URL.revokeObjectURL(profilePicPreview);
      setProfilePicPreview(null);
    }
  };

  const handleExtraPics = async (e) => {
    const files = Array.from(e.target.files);
    const remaining = 6 - extraPics.length;
    const toProcess = files.slice(0, remaining);
    
    for (const f of toProcess) {
      if (f.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB");
        continue;
      }
      const compressed = await compressImage(f, 800, 0.7);
      setExtraPics((p) => [...p, compressed]);
      setExtraPicsPreviews((p) => [...p, URL.createObjectURL(f)]);
    }
  };

  const removeExtraPic = (index) => {
    setExtraPics((p) => p.filter((_, i) => i !== index));
    URL.revokeObjectURL(extraPicsPreviews[index]);
    setExtraPicsPreviews((p) => p.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Customer name is required";
    if (!form.phone.trim()) return "Phone number is required";
    if (form.phone.length !== 10) return "Phone number must be exactly 10 digits";
    if (!form.address.trim()) return "Address is required";
    if (!form.area) return "Please select an area";
    if (!form.brand) return "Please select a brand";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      setUploading(true);
      let profileUrl = null;
      let additionalUrls = [];

      if (profilePic) {
        profileUrl = await uploadToCloudinary(profilePic, "mkl-admin/profiles");
      }
      if (extraPics.length > 0) {
        additionalUrls = await uploadMultiple(extraPics, "mkl-admin/additional");
      }
      setUploading(false);

      const customer = await createCustomer({
        ...form,
        service: parseInt(form.service || 0),
        register_date: date,
        profile_pic: profileUrl,
        additional_pics: additionalUrls,
      });

      setSaved({ ...customer, serviceDate: date });
      
      // Cleanup preview URLs
      if (profilePicPreview) URL.revokeObjectURL(profilePicPreview);
      extraPicsPreviews.forEach(url => URL.revokeObjectURL(url));
      
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        area: "",
        brand: "",
        service: "",
      });
      setProfilePic(null);
      setProfilePicPreview(null);
      setExtraPics([]);
      setExtraPicsPreviews([]);
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setError(err.message || "Failed to add customer");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    await generateServiceInvoice({
      customer: saved,
      serviceDate: saved.register_date || saved.serviceDate,
      savedData: {
        reminderMonths: saved.service,
        totalBill: null,
        paymentMode: "Cash",
      },
    });
  };

  if (saved)
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            Customer Added Successfully!
          </h2>
          <p className="text-slate-600 text-sm mb-1">
            <span className="font-bold text-slate-800">{saved.name}</span> has been registered.
          </p>
          <p className="text-slate-400 text-xs mb-6">
            Customer ID: #{saved.id?.slice(-8).toUpperCase()}
          </p>
          <div className="flex gap-3 mb-3">
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm shadow-md bg-emerald-600 hover:bg-emerald-700 transition-all"
            >
              <Download size={17} /> Download Invoice
            </button>
            <button
              onClick={() => setSaved(null)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all"
              style={{ background: "#1e3a8a" }}
            >
              Add Another
            </button>
          </div>
          <button
            onClick={() => router.push("/admin/customers")}
            className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors"
          >
            ← Back to Customers
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Add New Customer"
        subtitle="Register a new water purifier customer"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <User size={16} className="text-blue-600" /> Profile Picture
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border-2 border-blue-200">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-xl cursor-pointer text-sm font-bold hover:bg-blue-800 transition-all">
                  <Upload size={15} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePic}
                  />
                </label>
                {profilePicPreview && (
                  <button
                    type="button"
                    onClick={removeProfilePic}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                JPG, PNG or GIF. Max 5MB. Recommended: Square image
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Building size={16} className="text-blue-600" /> Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Customer Name" required>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Full name"
                className={inputCls}
              />
            </FormField>

            <FormField label="Phone Number" required>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  required
                  placeholder="10-digit mobile number"
                  className={`${inputCls} pl-9`}
                  maxLength="10"
                />
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </FormField>

            <FormField label="Email Address">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="customer@example.com"
                  className={`${inputCls} pl-9`}
                />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </FormField>

            <FormField label="Register Date" required>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={`${inputCls} pl-9`}
                />
              </div>
            </FormField>
          </div>

          <FormField label="Address" required>
            <div className="relative">
              <textarea
                name="address"
                value={form.address}
                onChange={onChange}
                required
                rows={3}
                placeholder="Full address with landmark if any"
                className={`${textareaCls} pl-9`}
              />
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </FormField>
        </div>

        {/* Configuration & Service */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Bell size={16} className="text-blue-600" /> Service Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Area" required>
              <select
                name="area"
                value={form.area}
                onChange={onChange}
                required
                className={selectCls}
                disabled={configLoading}
              >
                <option value="">
                  {configLoading ? "Loading areas…" : "Select Area"}
                </option>
                {areas.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
              {!configLoading && areas.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> No areas found. Add in{" "}
                  <a
                    href="/admin/configurations"
                    className="underline font-semibold hover:text-amber-700"
                  >
                    Configurations
                  </a>
                </p>
              )}
            </FormField>

            <FormField label="Purifier Brand" required>
              <select
                name="brand"
                value={form.brand}
                onChange={onChange}
                required
                className={selectCls}
                disabled={configLoading}
              >
                <option value="">
                  {configLoading ? "Loading brands…" : "Select Brand"}
                </option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
              {!configLoading && brands.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> No brands found. Add in{" "}
                  <a
                    href="/admin/configurations"
                    className="underline font-semibold hover:text-amber-700"
                  >
                    Configurations
                  </a>
                </p>
              )}
            </FormField>

            <FormField label="Next Reminder">
              <select
                name="service"
                value={form.service}
                onChange={onChange}
                className={selectCls}
              >
                <option value="">No Reminder</option>
                {REMINDER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Set when to remind for next service
              </p>
            </FormField>
          </div>
        </div>

        {/* Additional Pictures */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Image size={16} className="text-blue-600" /> Additional Pictures
            <span className="text-xs font-normal text-slate-400">
              ({extraPics.length}/6 uploaded)
            </span>
          </h3>
          
          <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${extraPics.length >= 6 ? 'border-slate-200 bg-slate-50 cursor-not-allowed' : 'border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100'}`}>
            <Upload size={24} className={extraPics.length >= 6 ? 'text-slate-400' : 'text-blue-500'} />
            <p className="text-sm text-slate-600 mt-2">
              {extraPics.length >= 6 ? 'Maximum 6 photos reached' : 'Click to upload additional photos'}
            </p>
            <p className="text-xs text-slate-400">JPG, PNG or GIF. Max 5MB each</p>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={extraPics.length >= 6}
              className="hidden"
              onChange={handleExtraPics}
            />
          </label>
          
          {extraPicsPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {extraPicsPreviews.map((pic, i) => (
                <div key={i} className="relative group">
                  <img src={pic} alt={`Additional ${i + 1}`} className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeExtraPic(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
                                <ErrorBanner message={error} />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || configLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-md disabled:opacity-60 transition-all hover:shadow-lg"
            style={{ background: "#1e3a8a" }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                {uploading ? "Uploading images..." : "Saving customer..."}
              </>
            ) : (
              <>
                <Save size={17} /> Save Customer
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/customers")}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
          >
            <X size={17} /> Cancel
          </button>
        </div>

      </form>
    </div>
  );
}
