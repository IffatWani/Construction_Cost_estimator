'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { runAreaEstimationWithRates } from '@/lib/estimationEngine'
import {
  BUILDING_TYPES,
  QUALITY_OPTIONS,
  STRUCTURE_TYPES,
  WALL_THICKNESSES,
  CURRENCIES,
  SAMPLE_PROJECT,
} from '@/lib/constants'
import type {
  BuildingType, ConstructionQuality, StructureType, WallThickness, Currency,
} from '@/lib/types'
import { Calculator, RefreshCw } from 'lucide-react'

interface FormState {
  projectName: string
  buildingType: BuildingType
  currency: Currency
  area: string
  floors: string
  quality: ConstructionQuality
  structureType: StructureType
  wallThickness: WallThickness
  ceilingHeight: string
}

export function AreaEstimatorForm() {
  const router = useRouter()
  const { settings, setCurrentResult, materialRates, setCurrency } = useAppStore()

  const [form, setForm] = useState<FormState>({
    projectName: '2BHK Residential House',
    buildingType: 'Residential',
    currency: '₹',
    area: '1200',
    floors: '1',
    quality: 'Standard',
    structureType: 'RCC Framed',
    wallThickness: '9 inch',
    ceilingHeight: '10',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [loading, setLoading] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {}
    if (!form.projectName.trim()) errs.projectName = 'Project name is required'
    const area = parseFloat(form.area)
    if (!form.area || isNaN(area) || area <= 0) errs.area = 'Area must be greater than zero'
    const floors = parseInt(form.floors)
    if (!form.floors || isNaN(floors) || floors < 1) errs.floors = 'Floors must be at least 1'
    const height = parseFloat(form.ceilingHeight)
    if (!form.ceilingHeight || isNaN(height) || height < 5) errs.ceilingHeight = 'Ceiling height must be at least 5 ft'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function loadSample() {
    setForm(prev => ({
      ...prev,
      projectName: SAMPLE_PROJECT.projectName,
      buildingType: SAMPLE_PROJECT.buildingType,
      area: String(SAMPLE_PROJECT.area),
      floors: String(SAMPLE_PROJECT.floors),
      quality: SAMPLE_PROJECT.quality,
      structureType: SAMPLE_PROJECT.structureType,
      wallThickness: SAMPLE_PROJECT.wallThickness,
      ceilingHeight: String(SAMPLE_PROJECT.ceilingHeight),
    }))
    setErrors({})
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      setCurrency(form.currency)
      const result = runAreaEstimationWithRates(
        {
          projectName: form.projectName,
          buildingType: form.buildingType,
          currency: form.currency,
          area: parseFloat(form.area),
          floors: parseInt(form.floors),
          quality: form.quality,
          structureType: form.structureType,
          wallThickness: form.wallThickness,
          ceilingHeight: parseFloat(form.ceilingHeight),
          settings,
        },
        materialRates
      )
      setCurrentResult(result)
      router.push('/reports')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project info */}
      <div className="card p-5">
        <p className="section-title">Project information</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="label">Project name *</label>
            <input
              className="input-field"
              value={form.projectName}
              onChange={e => set('projectName', e.target.value)}
              placeholder="e.g. 2BHK Residential"
            />
            {errors.projectName && <p className="mt-1 text-xs text-red-600">{errors.projectName}</p>}
          </div>
          <div>
            <label className="label">Building type</label>
            <select className="select-field" value={form.buildingType} onChange={e => set('buildingType', e.target.value as BuildingType)}>
              {BUILDING_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="select-field" value={form.currency} onChange={e => set('currency', e.target.value as Currency)}>
              {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Building specs */}
      <div className="card p-5">
        <p className="section-title">Building specifications</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Total area (sq ft) *</label>
            <input
              type="number"
              className="input-field"
              value={form.area}
              onChange={e => set('area', e.target.value)}
              min="1"
              placeholder="e.g. 1200"
            />
            {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
          </div>
          <div>
            <label className="label">Number of floors</label>
            <select className="select-field" value={form.floors} onChange={e => set('floors', e.target.value)}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}{n===5?'+':''}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Construction quality</label>
            <select className="select-field" value={form.quality} onChange={e => set('quality', e.target.value as ConstructionQuality)}>
              {QUALITY_OPTIONS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Structure type</label>
            <select className="select-field" value={form.structureType} onChange={e => set('structureType', e.target.value as StructureType)}>
              {STRUCTURE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Wall thickness</label>
            <select className="select-field" value={form.wallThickness} onChange={e => set('wallThickness', e.target.value as WallThickness)}>
              {WALL_THICKNESSES.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Ceiling height (ft)</label>
            <input
              type="number"
              className="input-field"
              value={form.ceilingHeight}
              onChange={e => set('ceilingHeight', e.target.value)}
              min="5"
              max="30"
            />
            {errors.ceilingHeight && <p className="mt-1 text-xs text-red-600">{errors.ceilingHeight}</p>}
          </div>
        </div>
      </div>

      {/* Cost factors */}
      <div className="card p-5">
        <p className="section-title">Cost factors</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Waste factor (%)</label>
            <input type="number" className="input-field" defaultValue={settings.wasteFactor} min="0" max="30"
              onChange={e => useAppStore.getState().updateSettings({ wasteFactor: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="label">Contingency (%)</label>
            <input type="number" className="input-field" defaultValue={settings.contingency} min="0" max="20"
              onChange={e => useAppStore.getState().updateSettings({ contingency: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="label">Tax rate (%)</label>
            <input type="number" className="input-field" defaultValue={settings.taxRate} min="0" max="50"
              onChange={e => useAppStore.getState().updateSettings({ taxRate: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={loading}>
          <Calculator className="h-4 w-4" />
          {loading ? 'Calculating…' : 'Calculate estimate'}
        </button>
        <button type="button" className="btn-secondary" onClick={loadSample}>
          <RefreshCw className="h-4 w-4" />
          Load sample project
        </button>
      </div>
    </form>
  )
}
