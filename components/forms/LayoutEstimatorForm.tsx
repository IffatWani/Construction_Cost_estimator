'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { runLayoutEstimationWithRates } from '@/lib/estimationEngine'
import {
  BUILDING_TYPES, QUALITY_OPTIONS, STRUCTURE_TYPES, WALL_THICKNESSES, CURRENCIES,
} from '@/lib/constants'
import type { BuildingType, ConstructionQuality, StructureType, WallThickness, Currency } from '@/lib/types'
import { Plus, Trash2, Calculator, Info, Upload } from 'lucide-react'

export function LayoutEstimatorForm() {
  const router = useRouter()
  const { rooms, addRoom, updateRoom, deleteRoom, settings, setCurrentResult, materialRates, setCurrency } = useAppStore()
  const [projectName, setProjectName] = useState('Layout Estimation Project')
  const [buildingType, setBuildingType] = useState<BuildingType>('Residential')
  const [currency, setCurrencyLocal] = useState<Currency>('₹')
  const [quality, setQuality] = useState<ConstructionQuality>('Standard')
  const [structureType, setStructureType] = useState<StructureType>('RCC Framed')
  const [wallThickness, setWallThickness] = useState<WallThickness>('9 inch')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!projectName.trim()) errs.projectName = 'Project name is required'
    if (rooms.length === 0) errs.rooms = 'Add at least one room'
    rooms.forEach(r => {
      if (!r.length || r.length <= 0) errs[`${r.id}_l`] = 'Invalid'
      if (!r.width || r.width <= 0) errs[`${r.id}_w`] = 'Invalid'
      if (!r.height || r.height <= 0) errs[`${r.id}_h`] = 'Invalid'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      setCurrency(currency)
      const result = runLayoutEstimationWithRates(
        { projectName, buildingType, currency, rooms, quality, structureType, wallThickness, settings },
        materialRates
      )
      setCurrentResult(result)
      router.push('/reports')
    } finally {
      setLoading(false)
    }
  }

  const totalArea = rooms.reduce((s, r) => s + r.length * r.width, 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project info */}
      <div className="card p-5">
        <p className="section-title">Project information</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Project name *</label>
            <input className="input-field" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" />
            {errors.projectName && <p className="mt-1 text-xs text-red-600">{errors.projectName}</p>}
          </div>
          <div>
            <label className="label">Building type</label>
            <select className="select-field" value={buildingType} onChange={e => setBuildingType(e.target.value as BuildingType)}>
              {BUILDING_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="select-field" value={currency} onChange={e => setCurrencyLocal(e.target.value as Currency)}>
              {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="label">Construction quality</label>
            <select className="select-field" value={quality} onChange={e => setQuality(e.target.value as ConstructionQuality)}>
              {QUALITY_OPTIONS.map(q => <option key={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Structure type</label>
            <select className="select-field" value={structureType} onChange={e => setStructureType(e.target.value as StructureType)}>
              {STRUCTURE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Wall thickness</label>
            <select className="select-field" value={wallThickness} onChange={e => setWallThickness(e.target.value as WallThickness)}>
              {WALL_THICKNESSES.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Rooms */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-title mb-0">Room dimensions</p>
            {totalArea > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">Total area: <span className="font-medium text-slate-700">{totalArea.toFixed(1)} sq ft</span></p>
            )}
          </div>
          <button type="button" className="btn-secondary text-xs" onClick={() => addRoom()}>
            <Plus className="h-3.5 w-3.5" /> Add room
          </button>
        </div>

        {errors.rooms && (
          <p className="mb-3 text-xs text-red-600 flex items-center gap-1">
            <span>⚠</span> {errors.rooms}
          </p>
        )}

        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[1fr_90px_90px_90px_40px] gap-2 mb-2 px-1">
          {['Room name', 'Length (ft)', 'Width (ft)', 'Height (ft)', ''].map(h => (
            <span key={h} className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</span>
          ))}
        </div>

        <div className="space-y-2">
          {rooms.map(room => (
            <div key={room.id} className="grid grid-cols-[1fr_80px_80px_80px_36px] gap-2 items-center">
              <input
                className="input-field text-xs"
                value={room.name}
                onChange={e => updateRoom(room.id, { name: e.target.value })}
                placeholder="Room name"
              />
              <input
                type="number"
                className={`input-field text-xs text-center ${errors[`${room.id}_l`] ? 'border-red-400' : ''}`}
                value={room.length}
                onChange={e => updateRoom(room.id, { length: parseFloat(e.target.value) || 0 })}
                min="0.1"
                step="0.5"
              />
              <input
                type="number"
                className={`input-field text-xs text-center ${errors[`${room.id}_w`] ? 'border-red-400' : ''}`}
                value={room.width}
                onChange={e => updateRoom(room.id, { width: parseFloat(e.target.value) || 0 })}
                min="0.1"
                step="0.5"
              />
              <input
                type="number"
                className={`input-field text-xs text-center ${errors[`${room.id}_h`] ? 'border-red-400' : ''}`}
                value={room.height}
                onChange={e => updateRoom(room.id, { height: parseFloat(e.target.value) || 0 })}
                min="0.1"
                step="0.5"
              />
              <button
                type="button"
                onClick={() => deleteRoom(room.id)}
                className="flex h-8 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No rooms added yet. Click &quot;Add room&quot; to start.
          </div>
        )}
      </div>

      {/* Drawing upload */}
      <div className="card p-5">
        <p className="section-title">Drawing upload (optional)</p>
        <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Automatic drawing interpretation can be integrated later using AI/CAD processing.
            Uploaded files are stored for reference only.
          </p>
        </div>
        <div
          className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">Click to upload drawing</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</p>
          {uploadedFile && <p className="text-xs text-emerald-600 mt-2 font-medium">✓ {uploadedFile}</p>}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          className="hidden"
          onChange={e => e.target.files?.[0] && setUploadedFile(e.target.files[0].name)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={loading || rooms.length === 0}>
          <Calculator className="h-4 w-4" />
          {loading ? 'Calculating…' : 'Calculate from rooms'}
        </button>
      </div>
    </form>
  )
}
