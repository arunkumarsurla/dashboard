import { getServiceClient } from '@/lib/supabase'
import { ok, serverErr } from '@/utils/api-response'

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, phone, email, area, deleted_at')
      .eq('is_deleted', true)
      .order('deleted_at', { ascending: false })

    if (error) throw error
    return ok(data)
  } catch (e) {
    return serverErr(e)
  }
}