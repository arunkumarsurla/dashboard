import { getToken } from '@/utils/auth'

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

// ── Areas ─────────────────────────────────────────────────────

export async function fetchAreas() {
  const res  = await fetch('/api/configurations/areas', { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch areas')
  return json.data
}

export async function createArea(name) {
  const res  = await fetch('/api/configurations/areas', {
    method: 'POST', headers: headers(), body: JSON.stringify({ name }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to create area')
  return json.data
}

export async function deleteArea(id) {
  const res  = await fetch(`/api/configurations/areas/${id}`, {
    method: 'DELETE', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete area')
  return json.data
}

// ── Brands ────────────────────────────────────────────────────

export async function fetchBrands() {
  const res  = await fetch('/api/configurations/brands', { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch brands')
  return json.data
}

export async function createBrand(name) {
  const res  = await fetch('/api/configurations/brands', {
    method: 'POST', headers: headers(), body: JSON.stringify({ name }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to create brand')
  return json.data
}

export async function deleteBrand(id) {
  const res  = await fetch(`/api/configurations/brands/${id}`, {
    method: 'DELETE', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete brand')
  return json.data
}


export async function fetchSpareParts() {
  const res  = await fetch('/api/configurations/spareparts', { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch spareparts')
  return json.data
}

export async function createSparePart(name) {
  const res  = await fetch('/api/configurations/spareparts', {
    method: 'POST', headers: headers(), body: JSON.stringify({ name }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to create sparepart')
  return json.data
}

export async function deleteSparePart(id) {
  const res  = await fetch(`/api/configurations/spareparts/${id}`, {
    method: 'DELETE', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete sparepart')
  return json.data
}