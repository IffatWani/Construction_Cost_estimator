'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Save, RotateCcw } from 'lucide-react'
import { DEFAULT_SETTINGS } from '@/lib/constants'

export default function SettingsPage() {
  const { settings, updateSettings, currency, setCurrency } = useAppStore()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    if (confirm('Reset all settings to defaults?')) {
      updateSettings(DEFAULT_SETTINGS)
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Cost factors */}
      <div className="card p-5">
        <p className="section-title">Default cost factors</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Waste factor (%)</label>
            <input
              type="number"
              className="input-field"
              value={settings.wasteFactor}
              min="0" max="30"
              onChange={e => updateSettings({ wasteFactor: parseFloat(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-slate-400">Typical: 5–10%</p>
          </div>
          <div>
            <label className="label">Contingency (%)</label>
            <input
              type="number"
              className="input-field"
              value={settings.contingency}
              min="0" max="20"
              onChange={e => updateSettings({ contingency: parseFloat(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-slate-400">Typical: 3–5%</p>
          </div>
          <div>
            <label className="label">Tax rate (%)</label>
            <input
              type="number"
              className="input-field"
              value={settings.taxRate}
              min="0" max="50"
              onChange={e => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-slate-400">India GST: 18%</p>
          </div>
        </div>
      </div>

      {/* Labor rates */}
      <div className="card p-5">
        <p className="section-title">Labor rates (% of material cost)</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Structural labor (%)</label>
            <input
              type="number"
              className="input-field"
              value={settings.laborStructuralPct}
              min="0" max="100"
              onChange={e => updateSettings({ laborStructuralPct: parseFloat(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-slate-400">Foundation, frame, slab</p>
          </div>
          <div>
            <label className="label">Finishing labor (%)</label>
            <input
              type="number"
              className="input-field"
              value={settings.laborFinishingPct}
              min="0" max="100"
              onChange={e => updateSettings({ laborFinishingPct: parseFloat(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-slate-400">Tiles, paint, fixtures</p>
          </div>
        </div>
      </div>

      {/* Quality multipliers */}
      <div className="card p-5">
        <p className="section-title">Construction quality multipliers</p>
        <p className="text-xs text-slate-500 mb-4">
          Applied to material quantities. 1.00 = Standard baseline.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Economy</label>
            <input
              type="number"
              className="input-field"
              value={settings.qualityMultipliers.Economy}
              step="0.01" min="0.1" max="3"
              onChange={e => updateSettings({
                qualityMultipliers: {
                  ...settings.qualityMultipliers,
                  Economy: parseFloat(e.target.value) || 0.8,
                },
              })}
            />
          </div>
          <div>
            <label className="label">Standard</label>
            <input
              type="number"
              className="input-field"
              value={settings.qualityMultipliers.Standard}
              step="0.01" min="0.1" max="3"
              onChange={e => updateSettings({
                qualityMultipliers: {
                  ...settings.qualityMultipliers,
                  Standard: parseFloat(e.target.value) || 1.0,
                },
              })}
            />
          </div>
          <div>
            <label className="label">Premium</label>
            <input
              type="number"
              className="input-field"
              value={settings.qualityMultipliers.Premium}
              step="0.01" min="0.1" max="3"
              onChange={e => updateSettings({
                qualityMultipliers: {
                  ...settings.qualityMultipliers,
                  Premium: parseFloat(e.target.value) || 1.35,
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="card p-5">
        <p className="section-title">Display currency</p>
        <div className="grid grid-cols-4 gap-3">
          {(['₹', '$', '£', '€'] as const).map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                currency === c
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn-success" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {saved ? 'Settings saved!' : 'Save settings'}
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
