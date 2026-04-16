'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Trash2, Eye, Users, MapPin, Search, Filter, X,
  Download,
  RefreshCw, SlidersHorizontal, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from 'lucide-react'
import { fetchCustomers, deleteCustomer } from '@/services/customers'
import { getServiceStatus, daysFromToday, getExpiryDate, fmtDate } from '@/utils/dates'
import CustomerDetails from '@/components/modals/CustomerDetails'
import ConfirmModal    from '@/components/modals/ConfirmModal'
import { PageHeader, Badge, PageSpinner, Avatar } from '@/components/ui'

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const PLAN_OPTIONS = [
  { value: 'all', label: 'All Plans'  },
  { value: '1',   label: '1 Month'   },
  { value: '3',   label: '3 Months'  },
  { value: '6',   label: '6 Months'  },
  { value: '12',  label: '12 Months' },
  { value: '0',   label: 'No Plan'   },
]

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const DEFAULT_FILTERS = {
  plan:  'all',
  area:  'All',
  brand: 'All',
}


// ─────────────────────────────────────────────────────────────
// CSV export
// ─────────────────────────────────────────────────────────────

function exportCSV(rows) {
  const headers = ['Name', 'Phone', 'Email', 'Address', 'Area', 'Brand', 'Plan (Months)', 'Service Date', 'Expiry Date', 'Status', 'Follow-up']
  const escape  = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines   = [
    headers.join(','),
    ...rows.map(c => {
      const expiry = c.service ? getExpiryDate(c.last_service_date, c.service).toLocaleDateString('en-GB') : '—'
      return [
        c.name, c.phone, c.email || '', c.address || '',
        c.area, c.brand, c.service || 0,
        c.last_service_date || '', expiry,
        getServiceStatus(c), c.follow_up_status || 'pending',
      ].map(escape).join(',')
    }),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `customers_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────
// Filter pill
// ─────────────────────────────────────────────────────────────

function Pill({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900 transition-colors">
        <X size={11} />
      </button>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// Filter panel
// ─────────────────────────────────────────────────────────────

function FilterPanel({ areas, brands, filters, onChange, onReset, resultCount }) {
  const activeCount = [
    filters.plan  !== 'all',
    filters.area  !== 'All',
    filters.brand !== 'All',
  ].filter(Boolean).length

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-blue-800" />
          <span className="text-sm font-bold text-slate-700">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
          {activeCount > 0 && (
            <button onClick={onReset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors">
              <X size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Service Plan</label>
          <select
            value={filters.plan}
            onChange={e => onChange('plan', e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
          >
            {PLAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Area</label>
          <select
            value={filters.area}
            onChange={e => onChange('area', e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">All Areas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Brand</label>
          <select
            value={filters.brand}
            onChange={e => onChange('brand', e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="All">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
          {filters.plan !== 'all' && (
            <Pill label={`Plan: ${PLAN_OPTIONS.find(o => o.value === filters.plan)?.label}`} onRemove={() => onChange('plan', 'all')} />
          )}
          {filters.area !== 'All' && (
            <Pill label={`Area: ${filters.area}`} onRemove={() => onChange('area', 'All')} />
          )}
          {filters.brand !== 'All' && (
            <Pill label={`Brand: ${filters.brand}`} onRemove={() => onChange('brand', 'All')} />
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Enhanced Pagination component with First/Last buttons
// ─────────────────────────────────────────────────────────────

function Pagination({ total, pageSize, currentPage, onPageChange, onPageSizeChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  // Build page numbers to show — always show first, last, current ± 1 with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5 // Maximum page buttons to show

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of visible range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at boundaries
      if (currentPage <= 2) end = 4
      if (currentPage >= totalPages - 1) start = totalPages - 3

      // Add ellipsis before middle section if needed
      if (start > 2) pages.push('...')

      // Add middle pages
      for (let i = start; i <= end; i++) pages.push(i)

      // Add ellipsis after middle section if needed
      if (end < totalPages - 1) pages.push('...')

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()
  const from = (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, total)

  return (
    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">

      {/* Left — rows per page + count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Show</span>
          <select
            value={pageSize}
            onChange={e => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(1)
            }}
            className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-600 bg-white focus:outline-none focus:border-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-xs text-slate-500">entries</span>
        </div>
        <span className="text-xs text-slate-400">
          Showing <span className="font-semibold text-slate-600">{from}</span> to <span className="font-semibold text-slate-600">{to}</span> of <span className="font-semibold text-slate-600">{total}</span>
        </span>
      </div>

      {/* Right — page buttons with First/Last */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-0.5 px-1">
          {pages.map((p, i) => p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-xs text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-[32px] rounded-lg text-xs font-semibold transition-colors border ${
                p === currentPage
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main page with enhanced sorting and pagination
// ─────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers,   setCustomers]   = useState([])
  const [search,      setSearch]      = useState('')
  const [filters,     setFilters]     = useState(DEFAULT_FILTERS)
  const [showFilter,  setShowFilter]  = useState(false)


  const [selected,    setSelected]    = useState(null)
  const [toDelete,    setToDelete]    = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize,    setPageSize]    = useState(25)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchCustomers()
      setCustomers(data || [])
    } finally {
      setLoading(false)
    }
  }

  const areas  = useMemo(() => [...new Set(customers.map(c => c.area ).filter(Boolean))].sort(), [customers])
  const brands = useMemo(() => [...new Set(customers.map(c => c.brand).filter(Boolean))].sort(), [customers])



  const changeFilter = useCallback((key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }))
    setCurrentPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSearch('')
    setCurrentPage(1)
  }, [])

  // All filtered + sorted rows
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()

    let rows = customers.filter(c => {
      if (q) {
        const hit =
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email   || '').toLowerCase().includes(q) ||
          (c.area    || '').toLowerCase().includes(q) ||
          (c.brand   || '').toLowerCase().includes(q) ||
          (c.address || '').toLowerCase().includes(q)
        if (!hit) return false
      }
      if (filters.plan !== 'all' && String(c.service || 0) !== filters.plan) return false
      if (filters.area !== 'All' && c.area !== filters.area) return false
      if (filters.brand !== 'All' && c.brand !== filters.brand) return false
      return true
    })



    return rows
  }, [customers, search, filters])

  // Paginated slice
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const activeFilterCount = useMemo(() =>
    [filters.plan !== 'all', filters.area !== 'All', filters.brand !== 'All'].filter(Boolean).length,
  [filters])

  const handleDelete = async () => {
    const id = toDelete?.id
    if (!id) return
    setToDelete(null)
    await deleteCustomer(id)
    load()
  }



  return (
    <>
      <PageHeader
        title="All Customers"
        subtitle={`${filtered.length} of ${customers.length} customer(s)`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => exportCSV(filtered)}
              disabled={filtered.length === 0}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors disabled:opacity-40"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setShowFilter(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                showFilter || activeFilterCount > 0
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={15} />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-700 text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative mb-4">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, email, area, brand, address…"
          className="w-full pl-11 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilter && (
        <FilterPanel
          areas={areas}
          brands={brands}
          filters={filters}
          onChange={changeFilter}
          onReset={resetFilters}
          resultCount={filtered.length}
        />
      )}

      {/* Active pills when panel is closed */}
      {!showFilter && activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-400">Active filters:</span>
          {filters.plan !== 'all' && (
            <Pill label={`Plan: ${PLAN_OPTIONS.find(o => o.value === filters.plan)?.label}`} onRemove={() => changeFilter('plan', 'all')} />
          )}
          {filters.area !== 'All' && (
            <Pill label={`Area: ${filters.area}`} onRemove={() => changeFilter('area', 'All')} />
          )}
          {filters.brand !== 'All' && (
            <Pill label={`Brand: ${filters.brand}`} onRemove={() => changeFilter('brand', 'All')} />
          )}
          <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? <PageSpinner /> : (
        <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="text-white sticky top-0 z-10" style={{ background: '#1e3a8a' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white hidden lg:table-cell">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white hidden lg:table-cell">Brand</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Last Service</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((c, i) => {
                  const status = getServiceStatus(c)
                  const expiry = c.service ? getExpiryDate(c.last_service_date, c.service) : null
                  const days   = c.service ? daysFromToday(c.last_service_date, c.service) : null

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="cursor-pointer border-t border-slate-100 hover:bg-blue-50/60 transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f8faff' }}
                    >
                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={c.profile_pic} name={c.name} size={8} />
                          <div>
                            <p className="font-bold text-sm text-blue-900">{c.name}</p>
                            {c.address && (
                              <p className="text-xs text-slate-400 truncate max-w-[140px]">{c.address}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{c.phone}</td>

                      {/* Area */}
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-blue-700 text-xs font-semibold">
                          <MapPin size={10} />{c.area}
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-3.5 text-sm text-slate-600 hidden lg:table-cell">{c.brand}</td>

                      {/* Plan */}
                      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
                        {c.service ? `${c.service}M` : <span className="text-slate-300">—</span>}
                      </td>

                      {/* Last Service */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {c.last_service_date ? (
                          <span className="text-sm text-slate-600">
                            {fmtDate(c.last_service_date)}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {expiry ? (
                          <div>
                            <p className={`text-xs font-semibold ${
                              status === 'expired' ? 'text-red-600'
                              : status === 'soon'  ? 'text-amber-600'
                              : 'text-slate-600'
                            }`}>
                              {fmtDate(expiry.toISOString().split('T')[0])}
                            </p>
                            <p className={`text-[11px] ${
                              status === 'expired' ? 'text-red-400'
                              : status === 'soon'  ? 'text-amber-400'
                              : 'text-slate-400'
                            }`}>
                              {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5"><Badge status={status} /></td>

                      {/* Actions */}
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelected(c)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-700 transition-colors"
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setToDelete({ id: c.id, name: c.name })}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                            title="Move to bin"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white">
                <Users size={32} className="mx-auto mb-3 text-slate-200" />
                <p className="text-slate-500 font-bold text-sm">No customers found</p>
                <p className="text-slate-400 text-xs mt-1">
                  {search || activeFilterCount > 0
                    ? 'Try adjusting your search or filters'
                    : 'Add your first customer to get started'}
                </p>
                {(search || activeFilterCount > 0) && (
                  <button
                    onClick={resetFilters}
                    className="mt-3 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination footer */}
          <Pagination
            total={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Modals */}
      {selected && (
        <CustomerDetails customer={selected} onClose={() => setSelected(null)} onUpdate={load} />
      )}

      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Move ${toDelete?.name} to Bin? You can restore them later.`}
      />
    </>
  )
}