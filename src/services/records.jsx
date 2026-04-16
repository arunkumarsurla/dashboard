import { getToken } from '@/utils/auth'

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

// ─── Service Records ────────────────────────────────────────

export async function createServiceRecord(data) {
  if (!data?.customer_id)   throw new Error('createServiceRecord: customer_id is required')
  if (!data?.customer_name) throw new Error('createServiceRecord: customer_name is required')
  if (!data?.total_bill)    throw new Error('createServiceRecord: total_bill is required')

  const res  = await fetch('/api/services', {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to create service record')
  return json.data
}

export async function deleteServiceRecord(id) {
  if (!id) throw new Error('deleteServiceRecord: id is required')

  const res  = await fetch(`/api/services/${id}`, {
    method: 'DELETE', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete service record')
  return json.data
}

/**
 * Fetch ALL service records (joined with customer data).
 * Each record includes: customer_phone, customer_area, customer_brand.
 * Accepts an optional {} options object (reserved for future use).
 */
export async function fetchAllServiceHistory(_options = {}) {
  const res  = await fetch('/api/services', { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch service history')
  return json.data || []
}

/**
 * Fetch service history for a single customer.
 * Returns records enriched with customer_phone, customer_area, customer_brand.
 */
export async function fetchServiceHistory(customerId = null) {
  const url  = customerId ? `/api/services?customer_id=${customerId}` : '/api/services'
  const res  = await fetch(url, { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch service history')
  return json.data || []
}

// ─── Bin ────────────────────────────────────────────────────

export async function fetchBin() {
  const res  = await fetch('/api/bin', { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch bin')
  return json.data || []
}

export async function restoreFromBin(id) {
  if (!id) throw new Error('restoreFromBin: id is required')

  const res  = await fetch(`/api/bin/${id}/restore`, {
    method: 'POST', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to restore')
  return json.data
}

export async function permanentDelete(id) {
  if (!id) throw new Error('permanentDelete: id is required')

  const res  = await fetch(`/api/bin/${id}`, {
    method: 'DELETE', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete permanently')
  return json.data
}