import type { MaterialCategory, ProjectSettings } from './types'

export const DEFAULT_MATERIAL_RATES: Record<string, number> = {
  'Cement': 420,
  'Sand': 55,
  'Aggregate': 45,
  'Steel': 70,
  'Bricks': 8,
  'Blocks': 12,
  'Concrete': 6500,
  'Water': 0.05,
  'Tiles': 80,
  'Paint': 350,
  'Electrical Conduits': 85,
  'Wiring': 55,
  'Plumbing Pipes': 120,
  'Doors': 8500,
  'Windows': 4200,
  'Roofing': 95,
}

export const MATERIAL_UNITS: Record<string, string> = {
  'Cement': 'Bags',
  'Sand': 'cu ft',
  'Aggregate': 'cu ft',
  'Steel': 'kg',
  'Bricks': 'nos',
  'Blocks': 'nos',
  'Concrete': 'cu m',
  'Water': 'litres',
  'Tiles': 'sq ft',
  'Paint': 'litres',
  'Electrical Conduits': 'm',
  'Wiring': 'm',
  'Plumbing Pipes': 'm',
  'Doors': 'nos',
  'Windows': 'nos',
  'Roofing': 'sq ft',
}

export const MATERIAL_CATEGORIES: Record<string, MaterialCategory> = {
  'Cement': 'Structure',
  'Sand': 'Structure',
  'Aggregate': 'Structure',
  'Steel': 'Structure',
  'Bricks': 'Masonry',
  'Blocks': 'Masonry',
  'Concrete': 'Structure',
  'Water': 'Misc',
  'Tiles': 'Finishing',
  'Paint': 'Finishing',
  'Electrical Conduits': 'MEP',
  'Wiring': 'MEP',
  'Plumbing Pipes': 'MEP',
  'Doors': 'Fixtures',
  'Windows': 'Fixtures',
  'Roofing': 'Structure',
}

export const DEFAULT_SETTINGS: ProjectSettings = {
  wasteFactor: 5,
  contingency: 3,
  taxRate: 18,
  laborStructuralPct: 25,
  laborFinishingPct: 15,
  qualityMultipliers: {
    Economy: 0.80,
    Standard: 1.00,
    Premium: 1.35,
  },
}

export const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
]

export const CATEGORY_COLORS: Record<MaterialCategory, string> = {
  Structure: '#3b82f6',
  Masonry: '#f59e0b',
  Finishing: '#10b981',
  MEP: '#8b5cf6',
  Fixtures: '#ec4899',
  Misc: '#6b7280',
}

export const SAMPLE_PROJECT = {
  projectName: '2BHK Residential House',
  buildingType: 'Residential' as const,
  area: 1200,
  floors: 1,
  quality: 'Standard' as const,
  structureType: 'RCC Framed' as const,
  wallThickness: '9 inch' as const,
  ceilingHeight: 10,
}

export const CURRENCIES = [
  { value: '₹', label: '₹ INR' },
  { value: '$', label: '$ USD' },
  { value: '£', label: '£ GBP' },
  { value: '€', label: '€ EUR' },
] as const

export const BUILDING_TYPES = [
  'Residential',
  'Apartment',
  'Commercial',
  'Villa',
  'Warehouse',
] as const

export const QUALITY_OPTIONS = ['Economy', 'Standard', 'Premium'] as const
export const STRUCTURE_TYPES = ['RCC Framed', 'Load Bearing', 'Steel Structure'] as const
export const WALL_THICKNESSES = ['4.5 inch', '9 inch'] as const
export const FLOOR_OPTIONS = [1, 2, 3, 4, 5] as const
