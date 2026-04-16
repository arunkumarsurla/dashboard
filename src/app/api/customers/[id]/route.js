import { getServiceClient } from "@/lib/supabase";
import { ok, err, serverErr } from "@/utils/api-response";

export async function GET(_, { params }) {
  try {
    const { id } = await params;
    if (!id) return err("Missing customer id", 400);

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return err("Customer not found", 404);
    return ok(data);
  } catch (e) {
    return serverErr(e);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!id) return err("Missing customer id", 400);

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

    if (phone && !/^\d{10}$/.test(phone))
      return err("Phone must be exactly 10 digits", 400);

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email || null;
    if (address !== undefined) updates.address = address.trim();
    if (area !== undefined) updates.area = area;
    if (brand !== undefined) updates.brand = brand;
    if (service !== undefined) updates.service = parseInt(service || 0);
    if (register_date !== undefined)
      updates.register_date = register_date || null;
    if (profile_pic !== undefined) updates.profile_pic = profile_pic;
    if (additional_pics !== undefined)
      updates.additional_pics = additional_pics;

    if (Object.keys(updates).length === 0)
      return err("No fields provided to update", 400);

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ok(data);
  } catch (e) {
    return serverErr(e);
  }
}

// Soft delete — customer moves to bin (is_deleted = true)
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    if (!id) return err("Missing customer id", 400);

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("customers")
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return ok(data);
  } catch (e) {
    return serverErr(e);
  }
}
