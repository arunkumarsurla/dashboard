import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return ok(data)
  } catch (e) {
    return serverErr(e)
  }
}

export async function POST(request) {
  try {
    const { customer_name, customer_id, subject, body } = await request.json()

    if (!customer_name) return err('customer_name is required', 400)
    if (!subject)       return err('subject is required', 400)
    if (!body)          return err('body is required', 400)

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        customer_name: customer_name.trim(),
        customer_id:   customer_id || null,
        subject:       subject.trim(),
        body:          body.trim(),
        status:        'pending',
      }])
      .select()
      .single()

    if (error) throw error
    return ok(data, 201)
  } catch (e) {
    return serverErr(e)
  }
}