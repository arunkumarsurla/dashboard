'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, CheckCircle ,Lock} from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (res.ok) {
        setSent(true)
      } else {
        setError(json.message || 'Something went wrong')
      }
    } catch {
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#f0f4f8 0%,#e0ecfb 50%,#dbeafe 100%)' }}
    >
      

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-7">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">We will send a reset link to your email</p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle size={56} className="text-green-500" />
            </div>
            <p className="text-slate-700 font-semibold">Check your inbox!</p>
            <p className="text-slate-400 text-sm">
              A password reset link has been sent to <span className="font-medium text-slate-600">{email}</span>.
              Check your spam folder if you dont see it.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-4 w-full py-3 rounded-xl border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50 transition-all"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-blue-50 p-1.5 rounded-lg">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mkl.com"
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                      outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
              >
                {loading
                  ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  : <Mail size={18} />}
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <button
              onClick={() => router.push('/login')}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-slate-500 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </>
        )}

        <p className="mt-5 text-center text-xs text-slate-400">
          Single-admin system · MKL Enterprises
        </p>
      </div>
    </div>
  )
}