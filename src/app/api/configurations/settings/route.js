import { getServiceClient } from '@/lib/supabase'
import { ok, serverErr } from '@/utils/api-response'

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')

    if (error) throw error

    // Convert array of {key,value} rows to a flat object
    const flat = Object.fromEntries(data.map(r => [r.key, r.value]))
    return ok(flat)
  } catch (e) {
    return serverErr(e)
  }
}

export async function PATCH(request) {
  try {
    const body    = await request.json()
    const supabase = getServiceClient()

    const rows = Object.entries(body).map(([key, value]) => ({ key, value: String(value) }))
    if (rows.length === 0) return ok({ updated: 0 })

    const { error } = await supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' })

    if (error) throw error
    return ok({ updated: rows.length })
  } catch (e) {
    return serverErr(e)
  }
}