import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

// ─── GET /api/services?customer_id=xxx ──────────────────────

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    const supabase = getServiceClient()

    let query = supabase
      .from('service_records')
      .select('*')
      .order('register_date', { ascending: false })

    if (customerId) {
      // ✅ return FULL history for customer view
      const { data, error } = await query.eq('customer_id', customerId)
      if (error) throw error
      return ok(data || [])
    }

    // ✅ dashboard → unique customers only
    const { data, error } = await query
    if (error) throw error

    const uniqueMap = new Map()

    for (const record of data || []) {
      if (!uniqueMap.has(record.customer_id)) {
        uniqueMap.set(record.customer_id, record)
      }
    }

    return ok(Array.from(uniqueMap.values()))
  } catch (e) {
    return serverErr(e)
  }
}

// ─── POST /api/services ─────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      customer_id,
      customer_name,
      register_date,
      spare_parts,
      images,
      total_bill,
      payment_mode,
      reminder_months,
      notes,
    } = body

    if (!customer_id)   return err('customer_id is required', 400)
    if (!customer_name) return err('customer_name is required', 400)
    if (!total_bill)    return err('total_bill is required', 400)

    const supabase  = getServiceClient()
    const serviceOn = register_date || new Date().toISOString().split('T')[0]

    const { data: record, error: recErr } = await supabase
      .from('service_records')
      .insert([{
        customer_id,
        customer_name,
        register_date:     serviceOn,
        spare_parts:       spare_parts || {},
        images:            images || [],
        total_bill:        parseFloat(total_bill),
        payment_mode:      payment_mode || 'Cash',
        reminder_months:   parseInt(reminder_months || 3),
        notes:             notes || null,
        last_service_date: serviceOn,
      }])
      .select()
      .single()

    if (recErr) throw recErr

    // keep customer's last_service_date + reminder in sync
    await supabase
      .from('customers')
      .update({
        last_service_date: serviceOn,
        service:           parseInt(reminder_months || 3),
        follow_up_status:  'pending',
      })
      .eq('id', customer_id)

    return ok(record, 201)
  } catch (e) {
    return serverErr(e)
  }
}