'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { fetchCustomers } from '@/services/customers'
import { createComplaint } from '@/services/complaints'
import { PageHeader, ErrorBanner, FormField, inputCls, textareaCls, PrimaryButton, GhostButton } from '@/components/ui'

export default function AddComplaintPage() {
  const router = useRouter()
  const [form, setForm]       = useState({ customer_name: '', customer_id: '', subject: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [customers, setCustomers] = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [showDrop,  setShowDrop]  = useState(false)
  const [exists,    setExists]    = useState(null)
  const dropRef = useRef(null)

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(() => {})
    const handler = e => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const onNameChange = (val) => {
    setForm(p => ({ ...p, customer_name: val, customer_id: '' }))
    if (!val.trim()) { setFiltered([]); setShowDrop(false); setExists(null); return }

    const q = val.toLowerCase().trim()

    // Match by name OR phone number
    const matches = customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone.includes(q)
    )
    setFiltered(matches)
    setShowDrop(matches.length > 0)

    // Exact match: full name equals OR full phone equals
    const exact = customers.find(c =>
      c.name.toLowerCase().trim() === q || c.phone === q
    )
    setExists(!!exact)
    if (exact) setForm(p => ({ ...p, customer_id: exact.id }))
  }

  const selectCustomer = (c) => {
    setForm(p => ({ ...p, customer_name: c.name, customer_id: c.id }))
    setShowDrop(false)
    setExists(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!exists) { setError('Please select a valid customer from the suggestions'); return }
    setLoading(true)
    try {
      await createComplaint(form)
      router.push('/admin/complaints')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Submit Complaint" subtitle="Log a new customer complaint"/>
      <ErrorBanner message={error}/>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Customer name autocomplete */}
          <div className="relative" ref={dropRef}>
            <FormField label="Customer Name" required>
              <div className="relative">
                <input
                  type="text" required value={form.customer_name} autoComplete="off"
                  onChange={e => onNameChange(e.target.value)}
                  onFocus={() => form.customer_name && filtered.length > 0 && setShowDrop(true)}
                  placeholder="Search by name or phone number…"
                  className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors pr-10 ${
                    exists === false && form.customer_name.trim() ? 'border-red-400 focus:border-red-500' :
                    exists === true  ? 'border-emerald-400 focus:border-emerald-500' :
                    'border-slate-200 focus:border-blue-500'}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {exists === true  && <CheckCircle size={17} className="text-emerald-500"/>}
                  {exists === false && form.customer_name.trim() && <AlertCircle size={17} className="text-red-500"/>}
                </div>
              </div>

              {/* Dropdown */}
              {showDrop && (
                <div className="absolute z-20 w-full mt-1 bg-white border-2 border-blue-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  {filtered.map(c => (
                    <div
                      key={c.id}
                      onClick={() => selectCustomer(c)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <p className="font-bold text-blue-900 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.phone} · {c.area}</p>
                    </div>
                  ))}
                </div>
              )}

              {exists === false && form.customer_name.trim() && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11}/> Customer not found in system
                </p>
              )}
              {exists === true && (
                <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={11}/> Customer verified ✓
                </p>
              )}
            </FormField>
          </div>

          <FormField label="Subject" required>
            <input
              type="text" required value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              placeholder="Brief subject of the complaint"
              className={inputCls}
            />
          </FormField>

          <FormField label="Complaint Details" required>
            <textarea
              required rows={6} value={form.body}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              placeholder="Describe the complaint in detail…"
              className={textareaCls}
            />
          </FormField>

          <div className="flex gap-3 pt-1">
            <PrimaryButton type="submit" disabled={loading}>
              {loading
                ? <><div className="spinner" style={{width:15,height:15,borderWidth:2}}/> Submitting…</>
                : <><FileText size={17}/> Submit Complaint</>
              }
            </PrimaryButton>
            <GhostButton onClick={() => router.push('/admin/complaints')}>Cancel</GhostButton>
          </div>
        </form>
      </div>
    </div>
  )
}