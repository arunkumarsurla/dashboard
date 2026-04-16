'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, Save, User, Calendar, Tag, FileText, AlertCircle } from 'lucide-react'
import { updateComplaint } from '@/services/complaints'

export default function ComplaintModal({ complaint, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState(null)
  const [form, setForm] = useState({
    subject: complaint?.subject || '',
    body: complaint?.body || '',
    status: complaint?.status || 'pending',
  })

  // Reset form when complaint changes
  useEffect(() => {
    if (complaint) {
      setForm({
        subject: complaint.subject || '',
        body: complaint.body || '',
        status: complaint.status || 'pending',
      })
      setErrors({})
      setSaveError(null)
      setEditing(false)
    }
  }, [complaint])

  // Clear errors when editing starts
  useEffect(() => {
    if (editing) {
      setErrors({})
      setSaveError(null)
    }
  }, [editing])

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    
    if (!form.subject?.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (form.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters'
    } else if (form.subject.trim().length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters'
    }

    if (!form.body?.trim()) {
      newErrors.body = 'Details are required'
    } else if (form.body.trim().length < 10) {
      newErrors.body = 'Details must be at least 10 characters'
    } else if (form.body.trim().length > 5000) {
      newErrors.body = 'Details must be less than 5000 characters'
    }

    if (!form.status || !['pending', 'resolved'].includes(form.status)) {
      newErrors.status = 'Invalid status selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field changes with real-time validation clearing
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSave = async () => {
    // Validate before saving
    if (!validateForm()) {
      return
    }

    // Check if complaint exists
    if (!complaint?.id) {
      setSaveError('Invalid complaint data. Please refresh and try again.')
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      const result = await updateComplaint(complaint.id, {
        subject: form.subject.trim(),
        body: form.body.trim(),
        status: form.status,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      setEditing(false)
      await onUpdate?.()
      onClose?.()
    } catch (e) {
      console.error('Failed to save complaint:', e)
      setSaveError(
        e?.response?.data?.message || 
        e?.message || 
        'Failed to save changes. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  // Handle cancel/close with unsaved changes warning
  const handleClose = () => {
    if (editing && hasUnsavedChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setEditing(false)
        setErrors({})
        setSaveError(null)
        onClose?.()
      }
    } else {
      onClose?.()
    }
  }

  // Check if form has changes from original
  const hasUnsavedChanges = () => {
    return (
      form.subject !== (complaint?.subject || '') ||
      form.body !== (complaint?.body || '') ||
      form.status !== (complaint?.status || 'pending')
    )
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [editing, form])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!complaint) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.6)' }} 
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-5 flex justify-between items-center rounded-t-2xl"
          style={{ background: '#1e3a8a' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <FileText size={17} className="text-white"/>
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Complaint Details</h2>
              <p className="text-blue-200 text-xs">ID: {complaint.id?.slice(-6) || 'N/A'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <button 
                onClick={() => setEditing(true)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition-all"
                aria-label="Edit complaint"
              >
                <Edit2 size={16}/>
              </button>
            ) : (
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all"
              >
                {saving ? (
                  <div className="spinner" style={{width:14,height:14,borderWidth:2}}/>
                ) : (
                  <Save size={15}/>
                )}
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}
            <button 
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition-all"
              aria-label="Close modal"
            >
              <X size={19}/>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {saveError && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5"/>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
            <button 
              onClick={() => setSaveError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={14}/>
            </button>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Customer Info */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
            <User size={16} className="text-blue-800"/>
            <div>
              <p className="text-xs text-slate-400">Customer</p>
              <p className="font-bold text-slate-800 text-sm">
                {complaint.customer_name || 'Unknown Customer'}
              </p>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Tag size={14} className="text-blue-800"/>
              <label className="text-xs font-semibold text-slate-600  tracking-wide">
                Subject
              </label>
              {editing && (
                <span className="text-xs text-slate-400 ml-auto">
                  {form.subject?.length || 0}/200
                </span>
              )}
            </div>
            {editing ? (
              <div>
                <input 
                  value={form.subject} 
                  onChange={e => handleChange('subject', e.target.value)}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
                    errors.subject 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter complaint subject..."
                  maxLength={200}
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12}/>
                    {errors.subject}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700">
                {complaint.subject || 'No subject'}
              </div>
            )}
          </div>

          {/* Body/Details Field */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <FileText size={14} className="text-blue-800"/>
              <label className="text-xs font-semibold text-slate-600  tracking-wide">
                Details
              </label>
              {editing && (
                <span className="text-xs text-slate-400 ml-auto">
                  {form.body?.length || 0}/5000
                </span>
              )}
            </div>
            {editing ? (
              <div>
                <textarea 
                  rows={6} 
                  value={form.body} 
                  onChange={e => handleChange('body', e.target.value)}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none resize-none transition-colors ${
                    errors.body 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter complaint details..."
                  maxLength={5000}
                />
                {errors.body && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12}/>
                    {errors.body}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 whitespace-pre-wrap min-h-[80px]">
                {complaint.body || 'No details provided'}
              </div>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="text-xs font-semibold text-slate-600  tracking-wide block mb-1.5">
              Status
            </label>
            {editing ? (
              <div>
                <select 
                  value={form.status} 
                  onChange={e => handleChange('status', e.target.value)}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none bg-white transition-colors ${
                    errors.status 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
                {errors.status && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12}/>
                    {errors.status}
                  </p>
                )}
              </div>
            ) : (
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${
                complaint.status === 'resolved' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  complaint.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}/>
                {complaint.status === 'resolved' ? 'Resolved' : 'Pending'}
              </span>
            )}
          </div>

          {/* Created At */}
          <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
            <Calendar size={16} className="text-blue-800"/>
            <div>
              <p className="text-xs text-slate-400">Submitted</p>
              <p className="font-semibold text-slate-800 text-sm">
                {complaint.created_at 
                  ? new Date(complaint.created_at).toLocaleString() 
                  : 'Unknown date'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}