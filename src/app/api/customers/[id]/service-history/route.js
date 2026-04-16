import { getServiceClient } from "@/lib/supabase";
import { ok, err, serverErr } from "@/utils/api-response";

export async function GET(_, { params }) {
  try {
    const { id } = await params;
    if (!id) return err("Missing customer id", 400);

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("service_records")
      .select("*")
      .eq("customer_id", id)
      .order("register_date", { ascending: false });

    if (error) throw error;
    return ok(data ?? []);
  } catch (e) {
    return serverErr(e);
  }
}
