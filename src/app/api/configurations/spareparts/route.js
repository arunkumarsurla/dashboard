import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('spareparts')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return ok(data)
  } catch (e) {
    return serverErr(e)
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json()
    if (!name?.trim()) return err('Sparepart name is required', 400)

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('spareparts')
      .insert([{ name: name.trim() }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return err('SparePart already exists', 409)
      throw error
    }
    return ok(data, 201)
  } catch (e) {
    return serverErr(e)
  }
}