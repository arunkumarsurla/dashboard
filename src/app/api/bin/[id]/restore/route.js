import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function POST(_, { params }) {
  try {
    const { id } = await params
    if (!id) return err('Missing id', 400)

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('customers')
      .update({ is_deleted: false, deleted_at: null })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return ok(data)
  } catch (e) {
    return serverErr(e)
  }
}