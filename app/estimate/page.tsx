'use client'

import { useState } from 'react'
import { AreaEstimatorForm } from '@/components/forms/AreaEstimatorForm'
import { LayoutEstimatorForm } from '@/components/forms/LayoutEstimatorForm'
import { cn } from '@/lib/utils'

type Tab = 'area' | 'layout'

export default function EstimatePage() {
  const [activeTab, setActiveTab] = useState<Tab>('area')

  return (
    <div className="max-w-4xl space-y-5">
      {/* Tab switcher */}
      <div className="inline-flex rounded-lg bg-slate-100 p-1">
        {([
          { id: 'area' as Tab, label: 'Area Based Estimation' },
          { id: 'layout' as Tab, label: 'Drawing Layout Estimation' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'area' ? (
        <AreaEstimatorForm />
      ) : (
        <LayoutEstimatorForm />
      )}
    </div>
  )
}
