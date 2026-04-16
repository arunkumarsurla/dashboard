import { NextResponse } from 'next/server'

export const ok = (data, status = 200) =>
  NextResponse.json({ success: true, data }, { status })

export const err = (message, status = 400, details = null) =>
  NextResponse.json({ success: false, message, ...(details && { details }) }, { status })

export const serverErr = (e) => {
  console.error('[API Error]', e)
  return err(e?.message || 'Internal server error', 500)
}
