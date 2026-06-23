'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your projects and estimates' },
  '/estimate': { title: 'New Estimate', subtitle: 'Calculate material quantities and costs' },
  '/materials': { title: 'Materials Database', subtitle: 'Manage unit rates and categories' },
  '/reports': { title: 'Reports', subtitle: 'View and export generated estimates' },
  '/settings': { title: 'Settings', subtitle: 'Configure defaults and labor rates' },
}

const mobileNav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/estimate', label: 'Estimate' },
  { href: '/materials', label: 'Materials' },
  { href: '/reports', label: 'Reports' },
  { href: '/settings', label: 'Settings' },
]

export function TopBar() {
  const pathname = usePathname()
  const meta = pageTitles[pathname] ?? { title: 'Construction Estimator', subtitle: '' }

  return (
    <>
      <header className="hidden md:flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-base font-semibold text-slate-900">{meta.title}</h1>
          {meta.subtitle && <p className="text-xs text-slate-500">{meta.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready
          </span>
        </div>
      </header>

      <header className="flex md:hidden items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
            <Building2 className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">CostEstimator</span>
        </div>
        <h1 className="text-sm font-medium text-slate-900">{meta.title}</h1>
      </header>

      <nav className="flex md:hidden overflow-x-auto border-b border-slate-200 bg-white px-4">
        {mobileNav.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors',
                active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
