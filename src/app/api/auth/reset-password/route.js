// app/api/auth/reset-password/route.js
import { createClient } from '@supabase/supabase-js'
import { ok, err, serverErr } from '@/utils/api-response'

export async function POST(request) {
  try {
    const { access_token, new_password } = await request.json()
    if (!access_token || !new_password) return err('Token and new password are required', 400)
    if (new_password.length < 8) return err('Password must be at least 8 characters', 400)

    // Use a user-scoped client with their token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: `Bearer ${access_token}` } } }
    )

    const { error } = await supabase.auth.updateUser({ password: new_password })
    if (error) return err(error.message, 400)

    return ok({ message: 'Password updated successfully.' })
  } catch (e) {
    return serverErr(e)
  }
}