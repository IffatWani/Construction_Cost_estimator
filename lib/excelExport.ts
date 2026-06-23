import type { EstimationResult } from './types'

function formatCurrency(value: number, currency: string): string {
  return `${currency}${Math.round(value).toLocaleString('en-IN')}`
}

export async function exportToExcel(result: EstimationResult): Promise<void> {
  const XLSX = (await import('xlsx')).default

  const wb = XLSX.utils.book_new()
  const c = result.currency

  // ─── Sheet 1: Project Summary ────────────────────────────────────────────
  const summaryData = [
    ['CONSTRUCTION MATERIAL COST ESTIMATOR', ''],
    ['', ''],
    ['PROJECT SUMMARY', ''],
    ['Project Name', result.projectName],
    ['Date', result.date],
    ['Estimation Method', result.method],
    ['Building Type', result.buildingType],
    ['Total Area', `${result.area} sq ft`],
    ['Number of Floors', result.floors],
    ['Currency', c],
    ['', ''],
    ['COST BREAKDOWN', ''],
    ['Material Cost', formatCurrency(result.summary.materialCost, c)],
    ['Labor Cost', formatCurrency(result.summary.laborCost, c)],
    ['Contingency', formatCurrency(result.summary.contingencyCost, c)],
    ['Tax', formatCurrency(result.summary.taxAmount, c)],
    ['GRAND TOTAL', formatCurrency(result.summary.grandTotal, c)],
  ]
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
  ws1['!cols'] = [{ wch: 30 }, { wch: 25 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Project Summary')

  // ─── Sheet 2: Material Details ───────────────────────────────────────────
  const matHeader = [
    'Material',
    'Category',
    'Quantity',
    'Unit',
    'Unit Rate',
    'Base Cost',
    'Waste Cost',
    'Total Cost',
  ]
  const matRows = result.items.map(it => [
    it.material,
    it.category,
    it.quantity,
    it.unit,
    it.rate,
    Math.round(it.baseCost),
    Math.round(it.wasteCost),
    Math.round(it.totalCost),
  ])
  const ws2 = XLSX.utils.aoa_to_sheet([matHeader, ...matRows])
  ws2['!cols'] = [
    { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
    { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 14 },
  ]
  XLSX.utils.book_append_sheet(wb, ws2, 'Material Details')

  // ─── Sheet 3: Cost Breakdown ─────────────────────────────────────────────
  const breakdownData = [
    ['Cost Component', 'Amount', 'Percentage'],
    [
      'Material Cost',
      Math.round(result.summary.materialCost),
      `${((result.summary.materialCost / result.summary.grandTotal) * 100).toFixed(1)}%`,
    ],
    [
      'Labor Cost',
      Math.round(result.summary.laborCost),
      `${((result.summary.laborCost / result.summary.grandTotal) * 100).toFixed(1)}%`,
    ],
    [
      'Contingency',
      Math.round(result.summary.contingencyCost),
      `${((result.summary.contingencyCost / result.summary.grandTotal) * 100).toFixed(1)}%`,
    ],
    [
      'Tax',
      Math.round(result.summary.taxAmount),
      `${((result.summary.taxAmount / result.summary.grandTotal) * 100).toFixed(1)}%`,
    ],
    ['Grand Total', Math.round(result.summary.grandTotal), '100%'],
  ]
  const ws3 = XLSX.utils.aoa_to_sheet(breakdownData)
  ws3['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(wb, ws3, 'Cost Breakdown')

  // ─── Sheet 4: Assumptions ────────────────────────────────────────────────
  const s = result.settings
  const assumptionsData = [
    ['Assumption', 'Value'],
    ['Waste Factor', `${s.wasteFactor}%`],
    ['Contingency', `${s.contingency}%`],
    ['Tax Rate', `${s.taxRate}%`],
    ['Labor – Structural', `${s.laborStructuralPct}%`],
    ['Labor – Finishing', `${s.laborFinishingPct}%`],
    ['Quality Multiplier – Economy', s.qualityMultipliers.Economy],
    ['Quality Multiplier – Standard', s.qualityMultipliers.Standard],
    ['Quality Multiplier – Premium', s.qualityMultipliers.Premium],
    ['Estimation Basis', 'Industry-standard ratios per 1,000 sq ft'],
    ['Base Cement (per 1000 sqft)', '400 bags'],
    ['Base Sand (per 1000 sqft)', '1800 cu ft'],
    ['Base Aggregate (per 1000 sqft)', '2200 cu ft'],
    ['Base Steel (per 1000 sqft)', '4000 kg'],
    ['Base Bricks (per 1000 sqft)', '8000 nos'],
  ]
  const ws4 = XLSX.utils.aoa_to_sheet(assumptionsData)
  ws4['!cols'] = [{ wch: 35 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, ws4, 'Assumptions')

  // ─── Sheet 5: Material Rates ─────────────────────────────────────────────
  const ratesHeader = ['Material', 'Unit', 'Rate', 'Category']
  const ratesRows = result.items.map(it => [it.material, it.unit, it.rate, it.category])
  const ws5 = XLSX.utils.aoa_to_sheet([ratesHeader, ...ratesRows])
  ws5['!cols'] = [{ wch: 22 }, { wch: 10 }, { wch: 10 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(wb, ws5, 'Material Rates')

  // Write file
  XLSX.writeFile(wb, `${result.projectName.replace(/\s+/g, '_')}_Estimate.xlsx`)
}

export function exportToCSV(result: EstimationResult): void {
  const c = result.currency
  const header = ['Material', 'Category', 'Quantity', 'Unit', 'Unit Rate', 'Base Cost', 'Waste Cost', 'Total Cost']
  const rows = result.items.map(it => [
    it.material,
    it.category,
    it.quantity,
    it.unit,
    `${c}${it.rate}`,
    `${c}${Math.round(it.baseCost)}`,
    `${c}${Math.round(it.wasteCost)}`,
    `${c}${Math.round(it.totalCost)}`,
  ])

  const csv = [header, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${result.projectName.replace(/\s+/g, '_')}_Estimate.csv`
  a.click()
  URL.revokeObjectURL(url)
}
