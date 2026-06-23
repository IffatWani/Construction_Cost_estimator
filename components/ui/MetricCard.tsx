import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  subtitle?: string
  icon?: LucideIcon
  iconClass?: string
  valueClass?: string
}

export function MetricCard({ label, value, subtitle, icon: Icon, iconClass, valueClass }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="metric-label">{label}</p>
          <p className={cn('metric-value truncate', valueClass)}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ml-3', iconClass)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}
