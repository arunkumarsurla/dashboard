'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Trash2, Archive } from 'lucide-react'
import { fetchBin, restoreFromBin, permanentDelete } from '@/services/records'
import ConfirmModal from '@/components/modals/ConfirmModal'
import { PageHeader, PageSpinner, TableWrapper, THead } from '@/components/ui'

const COLS = [
  { label: 'Name' },
  { label: 'Phone' },
  { label: 'Email',      hidden: 'hidden md:table-cell' },
  { label: 'Area',       hidden: 'hidden lg:table-cell' },
  { label: 'Deleted At', hidden: 'hidden lg:table-cell' },
  { label: 'Actions' },
]

export default function BinPage() {
  const [items,     setItems]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [toRestore, setToRestore] = useState(null)  // { id, name }
  const [toDelete,  setToDelete]  = useState(null)  // { id, name }

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchBin()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Bin"
        subtitle="Deleted customers — restore or permanently remove"
      />

      {loading ? <PageSpinner /> : (
        <>
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <Archive size={38} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 font-bold">Bin is empty</p>
              <p className="text-slate-400 text-sm mt-1">No deleted customers</p>
            </div>
          ) : (
            <TableWrapper>
              <THead cols={COLS} />
              <tbody>
                {items.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-50"
                    style={{ backgroundColor: i % 2 !== 0 ? '#f8faff' : 'white' }}
                  >
                    <td className="px-4 py-3.5 font-bold text-sm text-blue-900">{c.name}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 hidden md:table-cell">
                      {c.email || '—'}
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                        {c.area || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 hidden lg:table-cell">
                      {c.deleted_at
                        ? new Date(c.deleted_at).toLocaleDateString('en-GB')
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setToRestore({ id: c.id, name: c.name })}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw size={15} />
                        </button>
                        <button
                          onClick={() => setToDelete({ id: c.id, name: c.name })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          )}
        </>
      )}

      {/* Restore modal */}
      <ConfirmModal
        isOpen={!!toRestore}
        onClose={() => setToRestore(null)}
        onConfirm={async () => {
          const id = toRestore?.id
          if (!id) return
          setToRestore(null)
          await restoreFromBin(id)
          load()
        }}
        title="Restore Customer"
        message={`Restore ${toRestore?.name} back to active customers?`}
      />

      {/* Permanent delete modal */}
      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          const id = toDelete?.id
          if (!id) return
          setToDelete(null)
          await permanentDelete(id)
          load()
        }}
        title="Permanently Delete"
        message={`Permanently delete ${toDelete?.name}? This cannot be undone.`}
      />
    </>
  )
}