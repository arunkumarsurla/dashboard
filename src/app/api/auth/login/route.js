import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password)
      return err('Email and password are required', 400)

    const supabase = getServiceClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session)
      return err('Invalid credentials', 401)

    return ok({
      token: data.session.access_token,
      user: {
        id:    data.user.id,
        email: data.user.email,
        role:  data.user.role,
      },
    })
  } catch (e) {
    return serverErr(e)
  }
}
