import { getServiceClient } from '@/lib/supabase'
import { ok, err, serverErr } from '@/utils/api-response'

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('brands')
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
    if (!name || !name.trim()) return err('Brand name is required', 400)

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('brands')
      .insert([{ name: name.trim() }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return err('Brand already exists', 409)
      throw error
    }
    return ok(data, 201)
  } catch (e) {
    return serverErr(e)
  }
}
