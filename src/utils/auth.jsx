'use client'

const TOKEN_KEY  = 'ak_token'
const USER_KEY   = 'ak_user'
const EXPIRY_KEY = 'ak_expiry'

const EXPIRY_DAYS = 7
const EXPIRY_MS   = EXPIRY_DAYS * 24 * 60 * 60 * 1000

/* ─── helpers ─── */

const isBrowser = () => typeof window !== 'undefined'

const isExpired = () => {
  if (!isBrowser()) return true
  const expiry = localStorage.getItem(EXPIRY_KEY)
  return !expiry || Date.now() > Number(expiry)
}

/* ─── token ─── */

export const getToken = () => {
  if (!isBrowser()) return null
  if (isExpired()) { removeToken(); return null }
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token) => {
  if (!isBrowser()) return
  const expiry = Date.now() + EXPIRY_MS
  localStorage.setItem(TOKEN_KEY,  token)
  localStorage.setItem(EXPIRY_KEY, String(expiry))
}

export const removeToken = () => {
  if (!isBrowser()) return
  ;[TOKEN_KEY, USER_KEY, EXPIRY_KEY].forEach(k => localStorage.removeItem(k))
}

/* ─── user ─── */

export const setUser = (user) => {
  if (!isBrowser()) return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = () => {
  if (!isBrowser()) return null
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}

/* ─── status ─── */

export const isLoggedIn = () => !!getToken()

export const getExpiry = () => {
  if (!isBrowser()) return null
  const expiry = localStorage.getItem(EXPIRY_KEY)
  return expiry ? new Date(Number(expiry)) : null
}