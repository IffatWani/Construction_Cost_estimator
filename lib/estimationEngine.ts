import type {
  AreaEstimationInput,
  LayoutEstimationInput,
  EstimationResult,
  MaterialItem,
  CostSummary,
  MaterialCategory,
} from './types'
import { MATERIAL_UNITS, MATERIAL_CATEGORIES } from './constants'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function calculateQuantities(
  totalAreaSqFt: number,
  qualityMultiplier: number,
  wallFactor: number,
  structureMultiplier: number
): Record<string, number> {
  const base = totalAreaSqFt / 1000

  return {
    'Cement': Math.round(400 * base * qualityMultiplier * structureMultiplier),
    'Sand': Math.round(1800 * base * wallFactor),
    'Aggregate': Math.round(2200 * base * structureMultiplier),
    'Steel': Math.round(4000 * base * qualityMultiplier * structureMultiplier),
    'Bricks': Math.round(8000 * base * wallFactor),
    'Blocks': Math.round(2000 * base * wallFactor),
    'Concrete': Math.round(120 * base * structureMultiplier * 10) / 10,
    'Water': Math.round(15000 * base),
    'Tiles': Math.round(totalAreaSqFt * 0.85 * qualityMultiplier),
    'Paint': Math.round(totalAreaSqFt * 0.30 * qualityMultiplier * 2),
    'Electrical Conduits': Math.round(totalAreaSqFt * 0.40),
    'Wiring': Math.round(totalAreaSqFt * 0.80),
    'Plumbing Pipes': Math.round(totalAreaSqFt * 0.25),
    'Doors': Math.max(1, Math.round(totalAreaSqFt / 120)),
    'Windows': Math.max(1, Math.round(totalAreaSqFt / 80)),
    'Roofing': Math.round(totalAreaSqFt * 1.05),
  }
}

function buildMaterialItems(
  quantities: Record<string, number>,
  rates: Record<string, number>,
  wasteFactor: number
): MaterialItem[] {
  return Object.entries(quantities).map(([material, qty]) => {
    const rate = rates[material] ?? 0
    const baseCost = qty * rate
    const wasteCost = baseCost * (wasteFactor / 100)
    const totalCost = baseCost + wasteCost
    return {
      material,
      category: (MATERIAL_CATEGORIES[material] ?? 'Misc') as MaterialCategory,
      quantity: qty,
      unit: MATERIAL_UNITS[material] ?? '',
      rate,
      baseCost,
      wasteCost,
      totalCost,
    }
  })
}

function buildCostSummary(
  items: MaterialItem[],
  laborStructuralPct: number,
  laborFinishingPct: number,
  contingencyPct: number,
  taxRate: number
): CostSummary {
  const materialCost = items.reduce((s, it) => s + it.totalCost, 0)
  const laborCost = materialCost * (laborStructuralPct + laborFinishingPct) / 100
  const contingencyCost = (materialCost + laborCost) * (contingencyPct / 100)
  const subtotal = materialCost + laborCost + contingencyCost
  const taxAmount = subtotal * (taxRate / 100)
  const grandTotal = subtotal + taxAmount
  return { materialCost, laborCost, contingencyCost, taxAmount, grandTotal }
}

function getStructureMultiplier(structureType: string): number {
  switch (structureType) {
    case 'Steel Structure': return 1.20
    case 'Load Bearing': return 0.90
    default: return 1.00
  }
}

export function runAreaEstimationWithRates(
  input: AreaEstimationInput,
  rates: Record<string, number>
): EstimationResult {
  const { settings, quality, wallThickness, structureType, area, floors } = input
  const qualityMult = settings.qualityMultipliers[quality]
  const wallFactor = wallThickness === '4.5 inch' ? 0.75 : 1.0
  const structMult = getStructureMultiplier(structureType)
  const totalArea = area * floors
  const quantities = calculateQuantities(totalArea, qualityMult, wallFactor, structMult)
  const items = buildMaterialItems(quantities, rates, settings.wasteFactor)
  const summary = buildCostSummary(
    items,
    settings.laborStructuralPct,
    settings.laborFinishingPct,
    settings.contingency,
    settings.taxRate
  )
  return {
    id: generateId(),
    projectName: input.projectName,
    method: 'Area Based',
    buildingType: input.buildingType,
    currency: input.currency,
    area: input.area,
    floors: input.floors,
    date: new Date().toLocaleDateString('en-IN'),
    items,
    summary,
    settings,
  }
}

export function runLayoutEstimationWithRates(
  input: LayoutEstimationInput,
  rates: Record<string, number>
): EstimationResult {
  const { settings, quality, wallThickness, structureType, rooms } = input
  const qualityMult = settings.qualityMultipliers[quality]
  const wallFactor = wallThickness === '4.5 inch' ? 0.75 : 1.0
  const structMult = getStructureMultiplier(structureType)
  const totalArea = rooms.reduce((s, r) => s + r.length * r.width, 0)
  const quantities = calculateQuantities(totalArea, qualityMult, wallFactor, structMult)
  const items = buildMaterialItems(quantities, rates, settings.wasteFactor)
  const summary = buildCostSummary(
    items,
    settings.laborStructuralPct,
    settings.laborFinishingPct,
    settings.contingency,
    settings.taxRate
  )
  return {
    id: generateId(),
    projectName: input.projectName,
    method: 'Layout Based',
    buildingType: input.buildingType,
    currency: input.currency,
    area: totalArea,
    floors: 1,
    date: new Date().toLocaleDateString('en-IN'),
    items,
    summary,
    settings,
    rooms,
  }
}
