'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MATERIAL_UNITS, MATERIAL_CATEGORIES } from '@/lib/constants'
import { categoryBadgeClass } from '@/lib/utils'
import type { MaterialCategory } from '@/lib/types'
import { Save, RotateCcw, Search } from 'lucide-react'

export default function MaterialsPage() {
  const { materialRates, setMaterialRate, resetMaterialRates, currency } = useAppStore()
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)

  const filtered = Object.entries(materialRates).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  function handleReset() {
    if (confirm('Reset all rates to defaults?')) {
      resetMaterialRates()
    }
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-slate-500">
          {Object.keys(materialRates).length} materials · Edit unit rates below, then save.
        </p>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset to defaults
          </button>
          <button className="btn-success" onClick={handleSave}>
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save rates'}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          className="input-field pl-9"
          placeholder="Search materials…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-[1fr_120px_80px_100px] gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Material</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate ({currency})</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map(([name, rate]) => (
            <div key={name} className="px-5 py-3 grid grid-cols-[1fr_120px_80px_100px] gap-4 items-center hover:bg-slate-50/50">
              <span className="text-sm font-medium text-slate-900">{name}</span>
              <span>
                <span className={`badge ${categoryBadgeClass((MATERIAL_CATEGORIES[name] ?? 'Misc') as MaterialCategory)}`}>
                  {MATERIAL_CATEGORIES[name] ?? 'Misc'}
                </span>
              </span>
              <span className="text-xs text-slate-500">{MATERIAL_UNITS[name]}</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{currency}</span>
                <input
                  type="number"
                  className="input-field pl-6 text-right"
                  value={rate}
                  min="0"
                  step="0.01"
                  onChange={e => setMaterialRate(name, parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">No materials match your search.</div>
        )}
      </div>

      <div className="card p-5 bg-blue-50 border-blue-100">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">How rates are used</p>
        <p className="text-sm text-blue-600">
          These unit rates are applied to calculated quantities. Changes take effect on the next estimate run.
          Rates are persisted locally in your browser.
        </p>
      </div>
    </div>
  )
}
