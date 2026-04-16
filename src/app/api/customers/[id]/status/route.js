import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    if (!id) return err('Missing customer id', 400)

    const { status } = await request.json()
    if (!['pending', 'completed'].includes(status))
      return err('Status must be pending or completed', 400)

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('customers')
      .update({ follow_up_status: status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return ok(data)
  } catch (e) {
    return serverErr(e)
  }
}