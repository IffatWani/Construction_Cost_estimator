'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { MaterialItem } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

interface Props {
  items: MaterialItem[]
  currency: string
}

export function CostPieChart({ items, currency }: Props) {
  const categoryTotals = items.reduce<Record<string, number>>((acc, it) => {
    acc[it.category] = (acc[it.category] ?? 0) + it.totalCost
    return acc
  }, {})

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }))

  const total = data.reduce((s, d) => s + d.value, 0)

  const RADIAN = Math.PI / 180
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: {
    cx: number; cy: number; midAngle: number
    innerRadius: number; outerRadius: number; index: number
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const pct = total > 0 ? ((data[index].value / total) * 100).toFixed(0) : '0'
    if (Number(pct) < 5) return null
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {pct}%
      </text>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? '#6b7280'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatCurrency(value, currency), 'Cost']}
            contentStyle={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Custom legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
        {data.map(entry => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? '#6b7280' }}
            />
            {entry.name} ({total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0}%)
          </div>
        ))}
      </div>
    </div>
  )
}
