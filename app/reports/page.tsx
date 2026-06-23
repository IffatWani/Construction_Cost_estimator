'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { formatCurrency, categoryBadgeClass } from '@/lib/utils'
import { MetricCard } from '@/components/ui/MetricCard'
import { CostPieChart } from '@/components/charts/CostPieChart'
import { MaterialBarChart } from '@/components/charts/MaterialBarChart'
import { exportToExcel, exportToCSV } from '@/lib/excelExport'
import type { MaterialItem } from '@/lib/types'
import {
  FileText, Calculator, TrendingUp, Package, Layers, Search, ArrowUpDown,
  Download, FileSpreadsheet, AlertCircle,
} from 'lucide-react'

type SortKey = keyof Pick<MaterialItem, 'material' | 'category' | 'quantity' | 'rate' | 'totalCost'>
type SortDir = 'asc' | 'desc'

export default function ReportsPage() {
  const { currentResult } = useAppStore()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('totalCost')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [exporting, setExporting] = useState(false)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filteredItems = useMemo(() => {
    if (!currentResult) return []
    let items = currentResult.items.filter(it =>
      it.material.toLowerCase().includes(search.toLowerCase()) ||
      it.category.toLowerCase().includes(search.toLowerCase())
    )
    items = [...items].sort((a, b) => {
      const av = a[sortKey] as string | number
      const bv = b[sortKey] as string | number
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
    return items
  }, [currentResult, search, sortKey, sortDir])

  async function handleExcelExport() {
    if (!currentResult) return
    setExporting(true)
    try { await exportToExcel(currentResult) } finally { setExporting(false) }
  }

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mb-4">
          <FileText className="h-7 w-7 text-slate-400" />
        </div>
        <h2 className="text-base font-semibold text-slate-900 mb-2">No report available</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-5">
          Run an estimate first to generate a detailed material cost report.
        </p>
        <Link href="/estimate" className="btn-primary">
          <Calculator className="h-4 w-4" />
          Create estimate
        </Link>
      </div>
    )
  }

  const r = currentResult
  const c = r.currency

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-blue-600' : 'text-slate-300'}`} />
      </span>
    </th>
  )

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{r.projectName}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {r.method} · {r.area.toFixed(0)} sq ft · {r.floors} floor{r.floors > 1 ? 's' : ''} · {r.buildingType} · {r.date}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary" onClick={() => exportToCSV(currentResult)}>
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </button>
          <button className="btn-success" onClick={handleExcelExport} disabled={exporting}>
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting…' : 'Export Excel'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricCard label="Grand Total" value={formatCurrency(r.summary.grandTotal, c)} icon={TrendingUp} iconClass="text-emerald-600 bg-emerald-50" valueClass="text-emerald-700" />
        <MetricCard label="Material Cost" value={formatCurrency(r.summary.materialCost, c)} icon={Package} iconClass="text-blue-600 bg-blue-50" />
        <MetricCard label="Labor Cost" value={formatCurrency(r.summary.laborCost, c)} icon={Layers} iconClass="text-violet-600 bg-violet-50" />
        <MetricCard label="Contingency" value={formatCurrency(r.summary.contingencyCost, c)} icon={AlertCircle} iconClass="text-amber-600 bg-amber-50" />
        <MetricCard label={`Tax (${r.settings.taxRate}%)`} value={formatCurrency(r.summary.taxAmount, c)} icon={Calculator} iconClass="text-rose-600 bg-rose-50" />
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <p className="text-sm font-semibold text-slate-900 flex-1">Material quantities &amp; costs</p>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              className="input-field pl-8 text-xs w-48"
              placeholder="Search materials…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <SortHeader label="Material" field="material" />
                <SortHeader label="Category" field="category" />
                <SortHeader label="Qty" field="quantity" />
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                <SortHeader label="Unit rate" field="rate" />
                <SortHeader label="Total cost" field="totalCost" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map(it => (
                <tr key={it.material} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-900 whitespace-nowrap">{it.material}</td>
                  <td className="px-3 py-2.5">
                    <span className={`badge ${categoryBadgeClass(it.category)}`}>{it.category}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 tabular-nums">{it.quantity.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{it.unit}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-700 tabular-nums">{c}{it.rate.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(it.totalCost, c)}</td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-sm text-slate-400">No materials match your search.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={5} className="px-3 py-2.5 text-sm font-semibold text-slate-900 text-right">Material subtotal</td>
                <td className="px-3 py-2.5 text-sm font-bold text-blue-700 tabular-nums">{formatCurrency(r.summary.materialCost, c)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="section-title">Cost distribution</p>
          <CostPieChart items={r.items} currency={c} />
        </div>
        <div className="card p-5">
          <p className="section-title">Top 8 materials by cost</p>
          <MaterialBarChart items={r.items} currency={c} />
        </div>
      </div>

      <div className="card p-5">
        <p className="section-title">Full cost breakdown</p>
        <div className="space-y-3">
          {[
            { label: 'Material cost (with waste)', value: r.summary.materialCost, pct: r.summary.materialCost / r.summary.grandTotal },
            { label: 'Labor cost', value: r.summary.laborCost, pct: r.summary.laborCost / r.summary.grandTotal },
            { label: `Contingency (${r.settings.contingency}%)`, value: r.summary.contingencyCost, pct: r.summary.contingencyCost / r.summary.grandTotal },
            { label: `Tax (${r.settings.taxRate}%)`, value: r.summary.taxAmount, pct: r.summary.taxAmount / r.summary.grandTotal },
          ].map(({ label, value, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-36 text-xs text-slate-600 flex-shrink-0">{label}</div>
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, pct * 100).toFixed(1)}%` }} />
              </div>
              <div className="w-28 text-right text-sm font-medium text-slate-900 tabular-nums">{formatCurrency(value, c)}</div>
              <div className="w-10 text-right text-xs text-slate-400 tabular-nums">{(pct * 100).toFixed(1)}%</div>
            </div>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <div className="w-36 text-sm font-semibold text-slate-900">Grand total</div>
            <div className="flex-1" />
            <div className="w-28 text-right text-base font-bold text-emerald-700 tabular-nums">{formatCurrency(r.summary.grandTotal, c)}</div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {r.method === 'Layout Based' && r.rooms && r.rooms.length > 0 && (
        <div className="card p-5">
          <p className="section-title">Room breakdown</p>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Room', 'Length', 'Width', 'Height', 'Area (sq ft)'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {r.rooms.map(room => (
                  <tr key={room.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{room.name}</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{room.length} ft</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{room.width} ft</td>
                    <td className="px-3 py-2 text-sm text-slate-600">{room.height} ft</td>
                    <td className="px-3 py-2 text-sm font-medium text-slate-900">{(room.length * room.width).toFixed(1)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold">
                  <td className="px-3 py-2 text-sm" colSpan={4}>Total</td>
                  <td className="px-3 py-2 text-sm">{r.rooms.reduce((s, rm) => s + rm.length * rm.width, 0).toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card p-5">
        <p className="section-title">Estimation assumptions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: 'Waste factor', value: `${r.settings.wasteFactor}%` },
            { label: 'Contingency', value: `${r.settings.contingency}%` },
            { label: 'Tax rate', value: `${r.settings.taxRate}%` },
            { label: 'Labor (structural)', value: `${r.settings.laborStructuralPct}%` },
            { label: 'Labor (finishing)', value: `${r.settings.laborFinishingPct}%` },
            { label: 'Quality multiplier', value: r.settings.qualityMultipliers.Standard },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
