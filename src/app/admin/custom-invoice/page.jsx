'use client'

import { useState, useEffect } from 'react'
import { Download, FileText, CheckCircle, Phone, Mail, MapPin, Building, DollarSign, CreditCard, StickyNote } from 'lucide-react'
import { generateCustomInvoice } from '@/utils/pdf'
import { fetchSpareParts } from '@/services/configurations'
import { PAYMENT_MODES } from '@/utils/constants'
import { PageHeader, ErrorBanner, FormField, inputCls, textareaCls } from '@/components/ui'

const createBlank = (parts = []) => ({
  name: '', phone: '', email: '', address: '', brand: '',
  amount: '', paymentMode: 'Cash', notes: '',
  spareParts: Object.fromEntries(parts.map(p => [p, false])),
})

export default function CustomInvoicePage() {
  const [spareParts, setSpareParts] = useState([])
  const [form, setForm] = useState(createBlank())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await fetchSpareParts()
        if (!mounted) return

        const names = (data || [])
          .map(i => i?.name)
          .filter(Boolean)

        setSpareParts(names)
        setForm(createBlank(names))
      } catch (err) {
        console.error('Failed to load spare parts', err)
        setError('Failed to load spare parts. Please refresh the page.')
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone') {
      setForm(p => ({ ...p, phone: value.replace(/\D/g, '').slice(0, 10) }))
      return
    }
    setForm(p => ({ ...p, [name]: value }))
  }

  const handleSparePartToggle = (part) => {
    setForm(prev => ({
      ...prev,
      spareParts: {
        ...prev.spareParts,
        [part]: !prev.spareParts?.[part],
      },
    }))
  }

  const validateForm = () => {
    if (!form.name.trim()) return 'Customer name is required'
    if (!form.phone.trim()) return 'Phone number is required'
    if (form.phone.length !== 10) return 'Phone number must be 10 digits'
    if (!form.brand.trim()) return 'Purifier brand is required'
    if (form.amount && isNaN(Number(form.amount))) return 'Amount must be a valid number'
    return null
  }

  const generate = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)

    try {
      await generateCustomInvoice(form)
      setSuccess(true)
      setForm(createBlank(spareParts))
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to generate invoice', err)
      setError('Failed to generate invoice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedPartsCount = Object.values(form.spareParts).filter(Boolean).length

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Custom Invoice" 
        subtitle="Generate professional service invoices instantly"
      />
      
      <ErrorBanner message={error} />

      {success && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle size={15} /> Invoice generated and downloaded successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Stats */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
          <div className="flex justify-between items-center text-white">
            <div>
              <p className="text-xs opacity-80">Selected Spare Parts</p>
              <p className="text-2xl font-bold">{selectedPartsCount}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Payment Mode</p>
              <p className="text-lg font-semibold">{form.paymentMode || '—'}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Amount</p>
              <p className="text-lg font-semibold">₹{form.amount || '0'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <FileText size={16} className="text-blue-600" /> Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Customer Name" required>
                <div className="relative">
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={onChange} 
                    placeholder="Full name" 
                    className={`${inputCls} pl-9`}
                  />
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FormField>
              
              <FormField label="Phone Number" required>
                <div className="relative">
                  <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={onChange} 
                    placeholder="10-digit number" 
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
              
              <FormField label="Purifier Brand" required>
                <div className="relative">
                  <input 
                    type="text" 
                    name="brand" 
                    value={form.brand} 
                    onChange={onChange} 
                    placeholder="Brand name" 
                    className={`${inputCls} pl-9`}
                  />
                  <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </FormField>
            </div>
          </div>

          {/* Address Section */}
          <FormField label="Address">
            <div className="relative">
              <textarea 
                name="address" 
                value={form.address} 
                onChange={onChange}
                rows={2} 
                placeholder="Customer address" 
                className={`${textareaCls} pl-9`}
              />
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </FormField>

          {/* Spare Parts Section */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Spare Parts Replaced {selectedPartsCount > 0 && `(${selectedPartsCount} selected)`}
            </label>
            {spareParts.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">
                Loading spare parts...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-blue-50 rounded-xl">
                {spareParts.map(part => (
                  <label key={part} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!form.spareParts[part]}
                      onChange={() => handleSparePartToggle(part)}
                      className="w-4 h-4 rounded accent-blue-700"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-blue-800 transition-colors">
                      {part}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Amount (₹)">
              <div className="relative">
                <input 
                  type="number" 
                  name="amount" 
                  value={form.amount} 
                  onChange={onChange}
                  placeholder="Enter amount" 
                  className={`${inputCls} pl-9`}
                />
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </FormField>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
              <div className="flex gap-4 mt-1">
                {PAYMENT_MODES.map(mode => (
                  <label key={mode} className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMode" 
                      value={mode}
                      checked={form.paymentMode === mode} 
                      onChange={onChange}
                      className="w-4 h-4 accent-blue-700"
                    />
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      <CreditCard size={14} /> {mode}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <FormField label="Additional Notes">
            <div className="relative">
              <textarea 
                name="notes" 
                value={form.notes} 
                onChange={onChange}
                rows={3} 
                placeholder="Any special instructions or notes..." 
                className={`${textareaCls} pl-9`}
              />
              <StickyNote size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </FormField>

          {/* Generate Button */}
          <button 
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <Download size={18} />
            )}
            {loading ? 'Generating...' : 'Generate & Download Invoice'}
          </button>
        </div>
      </div>
    </div>
  )
}