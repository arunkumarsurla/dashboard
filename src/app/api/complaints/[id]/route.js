import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    if (!id) return err('Missing complaint id', 400)

    const body = await request.json()
    const { subject, body: text, status } = body

    const updates = {}
    if (subject !== undefined) updates.subject = subject.trim()
    if (text    !== undefined) updates.body    = text.trim()
    if (status  !== undefined) {
      if (!['pending', 'resolved'].includes(status))
        return err('Status must be pending or resolved', 400)
      updates.status = status
    }

    if (Object.keys(updates).length === 0)
      return err('No valid fields to update', 400)

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return ok(data)
  } catch (e) {
    return serverErr(e)
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params
    if (!id) return err('Missing complaint id', 400)

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id)

    if (error) throw error
    return ok({ id })
  } catch (e) {
    return serverErr(e)
  }
}