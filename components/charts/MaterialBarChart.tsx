'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { MaterialItem } from '@/lib/types'
import { CHART_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

interface Props {
  items: MaterialItem[]
  currency: string
  limit?: number
}

export function MaterialBarChart({ items, currency, limit = 8 }: Props) {
  const sorted = [...items]
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, limit)

  const data = sorted.map(it => ({
    name: it.material,
    value: Math.round(it.totalCost),
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#64748b' }}
          angle={-40}
          textAnchor="end"
          interval={0}
          height={60}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#64748b' }}
          tickFormatter={(v) => `${currency}${(v / 1000).toFixed(0)}k`}
          width={55}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value, currency), 'Cost']}
          contentStyle={{
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
