import { getToken } from '@/utils/auth'

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

/** Fetch all settings as a flat object: { company_name, company_phone, ... } */
export async function fetchSettings() {
  const res  = await fetch('/api/configurations/settings', { headers: headers() })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to fetch settings')
  return json.data || {}
}

/** Save one or more settings: updateSettings({ company_name: 'New Name' }) */
export async function updateSettings(updates) {
  const res  = await fetch('/api/configurations/settings', {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(updates),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Failed to save settings')
  return json.data
}