// app/api/auth/forgot-password/route.js
import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) return err('Email is required', 400)

    const supabase = getServiceClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) return err(error.message, 400)

    // Always return success to avoid email enumeration
    return ok({ message: 'If that email exists, a reset link has been sent.' })
  } catch (e) {
    return serverErr(e)
  }
}