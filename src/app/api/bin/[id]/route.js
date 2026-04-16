import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function DELETE(_, { params }) {
  try {
    const { id } = await params
    if (!id) return err('Missing id', 400)

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) throw error
    return ok({ id })
  } catch (e) {
    return serverErr(e)
  }
}