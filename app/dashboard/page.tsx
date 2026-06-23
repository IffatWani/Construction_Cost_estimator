'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { MetricCard } from '@/components/ui/MetricCard'
import { CostPieChart } from '@/components/charts/CostPieChart'
import { MaterialBarChart } from '@/components/charts/MaterialBarChart'
import { Calculator, TrendingUp, Package, Layers, ArrowRight, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { currentResult, results } = useAppStore()

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 mb-5">
          <Calculator className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">No estimates yet</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Create your first construction cost estimate to see your project summary and cost analytics here.
        </p>
        <Link href="/estimate" className="btn-primary">
          Create your first estimate
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  const r = currentResult
  const c = r.currency

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Current project</p>
          <p className="text-base font-semibold text-slate-900">{r.projectName}</p>
          <p className="text-xs text-slate-500">{r.method} · {r.area} sq ft · {r.date}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/estimate" className="btn-secondary text-xs">
            <Calculator className="h-3.5 w-3.5" />
            New estimate
          </Link>
          <Link href="/reports" className="btn-primary text-xs">
            View report
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Grand Total" value={formatCurrency(r.summary.grandTotal, c)} icon={TrendingUp} iconClass="text-emerald-600 bg-emerald-50" valueClass="text-emerald-700" />
        <MetricCard label="Material Cost" value={formatCurrency(r.summary.materialCost, c)} icon={Package} iconClass="text-blue-600 bg-blue-50" />
        <MetricCard label="Labor Cost" value={formatCurrency(r.summary.laborCost, c)} icon={Layers} iconClass="text-violet-600 bg-violet-50" />
        <MetricCard label="Tax & Contingency" value={formatCurrency(r.summary.taxAmount + r.summary.contingencyCost, c)} icon={Calculator} iconClass="text-amber-600 bg-amber-50" valueClass="text-amber-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="section-title">Cost distribution by category</p>
          <CostPieChart items={r.items} currency={c} />
        </div>
        <div className="card p-5">
          <p className="section-title">Top materials by cost</p>
          <MaterialBarChart items={r.items} currency={c} />
        </div>
      </div>

      {results.length > 1 && (
        <div className="card p-5">
          <p className="section-title flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Recent estimates
          </p>
          <div className="space-y-2">
            {results.slice(0, 5).map(res => (
              <div key={res.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{res.projectName}</p>
                  <p className="text-xs text-slate-500">{res.method} · {res.area} sq ft · {res.date}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-700">
                  {formatCurrency(res.summary.grandTotal, res.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
