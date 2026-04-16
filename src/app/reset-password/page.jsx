'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, EyeOff, Eye, CheckCircle, AlertTriangle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [ready, setReady]       = useState(false)   // session exchanged?
  const [tokenErr, setTokenErr] = useState(false)

  useEffect(() => {
    // Supabase PKCE flow puts ?code=XXX in the URL query string
    const params = new URLSearchParams(window.location.search)
    const code   = params.get('code')

    if (!code) {
      // Fallback: try legacy hash-based token (older Supabase versions)
      const hash      = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const type      = hashParams.get('type')
      if (type === 'recovery') {
        // Exchange hash tokens into a session
        supabase.auth.getSession().then(({ data }) => {
          if (data.session) setReady(true)
          else setTokenErr(true)
        })
      } else {
        setTokenErr(true)
      }
      return
    }

    // Exchange the code for a real session
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('Exchange error:', error.message)
        setTokenErr(true)
      } else {
        setReady(true)
        // Clean the URL so code can't be replayed
        window.history.replaceState({}, '', '/reset-password')
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      // Session is already set by exchangeCodeForSession — just call updateUser directly
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        await supabase.auth.signOut()          // clear the recovery session
        setTimeout(() => router.push('/login'), 3000)
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
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">Create a new secure password</p>
        </div>

        {tokenErr ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle size={56} className="text-amber-500" />
            </div>
            <p className="text-slate-700 font-semibold">Invalid or Expired Link</p>
            <p className="text-slate-400 text-sm">
              This reset link is invalid or has already been used. Please request a new one.
            </p>
            <button
              onClick={() => router.push('/forgot-password')}
              className="mt-2 w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Request New Link
            </button>
          </div>
        ) : success ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle size={56} className="text-green-500" />
            </div>
            <p className="text-slate-700 font-semibold">Password Updated!</p>
            <p className="text-slate-400 text-sm">Redirecting you to login…</p>
          </div>
        ) : !ready ? (
          // While exchanging the code, show a spinner
          <div className="flex flex-col items-center justify-center py-12">
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
            <p className="text-gray-500 text-sm mt-4">Verifying reset link...</p>
          </div>
        ) : (
          // The actual form — only shown once session is ready
          <>
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertTriangle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">New Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-gray-50 hover:bg-white"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}