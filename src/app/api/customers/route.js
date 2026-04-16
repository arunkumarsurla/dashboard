import { getServiceClient } from "@/lib/supabase";
import { ok, err, serverErr } from "@/utils/api-response";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area")?.trim() || null;

    const supabase = getServiceClient();

    let query = supabase
      .from("customers")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (area) query = query.ilike("area", area);

    const { data, error } = await query;
    if (error) throw error;

    return ok(data);
  } catch (e) {
    return serverErr(e);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      address,
      area,
      brand,
      service,
      register_date,
      profile_pic,
      additional_pics,
    } = body;

    if (!name || !phone || !address || !area || !brand)
      return err("name, phone, address, area, brand are required", 400);

    if (!/^\d{10}$/.test(phone))
      return err("Phone must be exactly 10 digits", 400);

    const supabase = getServiceClient();

    // 🔴 STEP 1: CHECK IF PHONE ALREADY EXISTS
    const { data: existingCustomer, error: fetchError } = await supabase
      .from("customers")
      .select("id") // only need minimal field
      .eq("phone", phone)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingCustomer) {
      return err("Customer with this phone number already exists", 409);
    }

    // 🟢 STEP 2: INSERT ONLY IF NOT EXISTS
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name: name.trim(),
          phone,
          email: email || null,
          address: address.trim(),
          area,
          brand,
          service: parseInt(service || 0),
          register_date: register_date || null,
          last_service_date: register_date || null,
          profile_pic: profile_pic || null,
          additional_pics: additional_pics || [],
          follow_up_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return ok(data, 201);
  } catch (e) {
    return serverErr(e);
  }
}