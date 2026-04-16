'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, FileText, MessageSquare } from 'lucide-react'
import { fetchComplaints, deleteComplaint, updateComplaint } from '@/services/complaints'
import ConfirmModal    from '@/components/modals/ConfirmModal'
import ComplaintModal  from '@/components/modals/ComplaintModal'
import { PageHeader, SearchBar, PageSpinner, EmptyState, TableWrapper, THead } from '@/components/ui'

const COLS = [
  { label: 'Customer' },
  { label: 'Subject' },
  { label: 'Details', hidden: 'hidden md:table-cell' },
  { label: 'Date',    hidden: 'hidden lg:table-cell' },
  { label: 'Status' },
  { label: 'Actions' },
]

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([])
  const [search,     setSearch]     = useState('')
  const [toDelete,   setToDelete]   = useState(null)   // { id, name }
  const [selected,   setSelected]   = useState(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchComplaints()
      setComplaints(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const id = toDelete?.id       // capture before state clears
    if (!id) return
    setToDelete(null)
    await deleteComplaint(id)
    load()
  }

  const toggleStatus = async (e, id, status) => {
    e.stopPropagation()
    if (!id) return
    await updateComplaint(id, { status })
    load()
  }

  const filtered = complaints.filter(c =>
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  )

  const total    = complaints.length
  const pending  = complaints.filter(c => c.status === 'pending').length
  const resolved = complaints.filter(c => c.status === 'resolved').length

  return (
    <>
      <PageHeader
        title="Customer Complaints"
        subtitle={`${total} total complaint${total !== 1 ? 's' : ''}`}
        action={
          <Link
            href="/admin/add-complaint"
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            style={{ background: '#1e3a8a' }}
          >
            <FileText size={17} /> New Complaint
          </Link>
        }
      />

      {/* Stats */}
      {/* <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total',    value: total,    color: '#1e3a8a', bg: 'bg-blue-50'   },
          { label: 'Pending',  value: pending,  color: '#f59e0b', bg: 'bg-amber-50'  },
          { label: 'Resolved', value: resolved, color: '#10b981', bg: 'bg-emerald-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-500 font-bold mt-0.5">{label}</p>
          </div>
        ))}
      </div> */}

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by customer or subject…"
      />

      {loading ? <PageSpinner /> : (
        <>
          <TableWrapper>
            <THead cols={COLS} />
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="border-b border-slate-50 cursor-pointer"
                  style={{ backgroundColor: i % 2 !== 0 ? '#f8faff' : 'white' }}
                >
                  <td className="px-4 py-3.5 font-bold text-sm text-blue-900">
                    {c.customer_name}
                  </td>

                  <td className="px-4 py-3.5 text-sm text-slate-700">
                    {c.subject.length > 28 ? c.subject.slice(0, 28) + '…' : c.subject}
                  </td>

                  <td className="px-4 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {c.body.length > 32 ? c.body.slice(0, 32) + '…' : c.body}
                  </td>

                  <td className="px-4 py-3.5 text-sm text-slate-500 hidden lg:table-cell">
                    {new Date(c.created_at).toLocaleDateString('en-GB')}
                  </td>

                  {/* Status toggle — stop row click */}
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={e => toggleStatus(e, c.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${
                        c.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>

                  {/* Delete — stop row click */}
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setToDelete({ id: c.id, name: c.customer_name })}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete complaint"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>

          {filtered.length === 0 && (
            <EmptyState icon={MessageSquare} title="No complaints found" />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Complaint"
        message={`Delete complaint from ${toDelete?.name}? This cannot be undone.`}
      />

      {selected && (
        <ComplaintModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onUpdate={load}
        />
      )}
    </>
  )
}