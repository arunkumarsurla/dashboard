import { getToken } from '@/utils/auth'

const base = '/api/complaints'

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function fetchComplaints() {
  const res  = await fetch(base, { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch complaints')
  return json.data || []
}

export async function createComplaint(data) {
  if (!data?.customer_name) throw new Error('createComplaint: customer_name is required')
  if (!data?.subject)       throw new Error('createComplaint: subject is required')
  if (!data?.body)          throw new Error('createComplaint: body is required')

  const res  = await fetch(base, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to create complaint')
  return json.data
}

export async function updateComplaint(id, data) {
  if (!id) throw new Error('updateComplaint: id is required')

  const res  = await fetch(`${base}/${id}`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to update complaint')
  return json.data
}

export async function deleteComplaint(id) {
  if (!id) throw new Error('deleteComplaint: id is required')

  const res  = await fetch(`${base}/${id}`, {
    method: 'DELETE', headers: headers(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to delete complaint')
  return json.data
}