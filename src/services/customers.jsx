import { getToken } from "@/utils/auth";

const base = "/api/customers";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function fetchCustomers(area = null) {
  const url = area ? `${base}?area=${encodeURIComponent(area)}` : base;
  const res = await fetch(url, { headers: headers() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch customers");
  return json.data || [];
}

export async function fetchCustomer(id) {
  if (!id) throw new Error("fetchCustomer: id is required");
  const res = await fetch(`${base}/${id}`, { headers: headers() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch customer");
  return json.data;
}

export async function createCustomer(data) {
  const res = await fetch(base, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create customer");
  return json.data;
}

export async function updateCustomer(id, data) {
  if (!id) throw new Error("updateCustomer: id is required");
  const res = await fetch(`${base}/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update customer");
  return json.data;
}

export async function deleteCustomer(id) {
  if (!id) throw new Error("deleteCustomer: id is required");
  const res = await fetch(`${base}/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete customer");
  return json.data;
}

export async function updateCustomerStatus(id, status) {
  if (!id) throw new Error("updateCustomerStatus: id is required");
  const res = await fetch(`${base}/${id}/status`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      status,
      last_service_date: new Date().toISOString().split("T")[0],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update status");
  return json.data;
}

export async function fetchServiceHistory(customerId) {
  if (!customerId)
    throw new Error("fetchServiceHistory: customerId is required");
  const res = await fetch(`${base}/${customerId}/service-history`, {
    headers: headers(),
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message || "Failed to fetch service history");
  return json.data || [];
}
