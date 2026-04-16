// ── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 22, border = 3 }) {
  return (
    <div className="spinner"
      style={{ width: size, height: size, borderWidth: border }}/>
  )
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Spinner size={30} border={3}/>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────
const badgeStyles = {
  active:   'bg-emerald-100 text-emerald-700',
  soon:     'bg-amber-100 text-amber-700',
  expired:  'bg-red-100 text-red-700',
  pending:  'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}

const badgeLabels = {
  active: 'Active', soon: 'Soon', expired: 'Expired',
  pending: 'Pending', resolved: 'Resolved',
}

export function Badge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeStyles[status] || 'bg-slate-100 text-slate-600'}`}>
      {badgeLabels[status] || status}
    </span>
  )
}

// ── PageHeader ────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── SearchBar ─────────────────────────────────────────────────
import { Search } from 'lucide-react'

export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative mb-5">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17}/>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
      />
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-16">
      <Icon size={38} className="mx-auto text-slate-300 mb-3"/>
      <p className="text-slate-400 font-bold">{title}</p>
      {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}

// ── ErrorBanner ───────────────────────────────────────────────
import { AlertCircle } from 'lucide-react'

export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
      <AlertCircle size={15}/>
      {message}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

// ── PrimaryButton ─────────────────────────────────────────────
export function PrimaryButton({ children, onClick, disabled, type = 'button', className = '' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`flex items-center gap-2 px-5 py-3 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 ${className}`}
      style={{ background: '#1e3a8a' }}>
      {children}
    </button>
  )
}

// ── GhostButton ───────────────────────────────────────────────
export function GhostButton({ children, onClick, type = 'button' }) {
  return (
    <button type={type} onClick={onClick}
      className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors">
      {children}
    </button>
  )
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ src, name, size = 8 }) {
  const cls = `w-${size} h-${size} rounded-full overflow-hidden bg-blue-50 flex-shrink-0`
  return (
    <div className={cls}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover"/>
        : <div className="w-full h-full flex items-center justify-center text-blue-400 font-black">
            {name?.charAt(0)?.toUpperCase()}
          </div>
      }
    </div>
  )
}

// ── TableWrapper ──────────────────────────────────────────────
export function TableWrapper({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  )
}

export function THead({ cols }) {
  return (
    <thead style={{ background: '#1e3a8a' }}>
      <tr>
        {cols.map((c, i) => (
          <th key={i} className={`px-4 py-3.5 text-left text-xs font-bold text-blue-100  tracking-wide ${c.hidden || ''}`}>
            {c.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

// ── FormField ─────────────────────────────────────────────────
export function FormField({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export const inputCls = 'w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors'
export const selectCls = inputCls + ' bg-white'
export const textareaCls = inputCls + ' resize-none'
