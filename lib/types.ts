export type BuildingType = 'Residential' | 'Apartment' | 'Commercial' | 'Villa' | 'Warehouse'
export type ConstructionQuality = 'Economy' | 'Standard' | 'Premium'
export type StructureType = 'RCC Framed' | 'Load Bearing' | 'Steel Structure'
export type WallThickness = '4.5 inch' | '9 inch'
export type EstimationMethod = 'Area Based' | 'Layout Based'
export type Currency = '₹' | '$' | '£' | '€'

export interface Room {
  id: string
  name: string
  length: number
  width: number
  height: number
}

export interface MaterialRate {
  name: string
  rate: number
  unit: string
  category: MaterialCategory
}

export type MaterialCategory = 'Structure' | 'Masonry' | 'Finishing' | 'MEP' | 'Fixtures' | 'Misc'

export interface MaterialItem {
  material: string
  category: MaterialCategory
  quantity: number
  unit: string
  rate: number
  baseCost: number
  wasteCost: number
  totalCost: number
}

export interface CostSummary {
  materialCost: number
  laborCost: number
  contingencyCost: number
  taxAmount: number
  grandTotal: number
}

export interface ProjectSettings {
  wasteFactor: number
  contingency: number
  taxRate: number
  laborStructuralPct: number
  laborFinishingPct: number
  qualityMultipliers: {
    Economy: number
    Standard: number
    Premium: number
  }
}

export interface AreaEstimationInput {
  projectName: string
  buildingType: BuildingType
  currency: Currency
  area: number
  floors: number
  quality: ConstructionQuality
  structureType: StructureType
  wallThickness: WallThickness
  ceilingHeight: number
  settings: ProjectSettings
}

export interface LayoutEstimationInput {
  projectName: string
  buildingType: BuildingType
  currency: Currency
  rooms: Room[]
  quality: ConstructionQuality
  structureType: StructureType
  wallThickness: WallThickness
  settings: ProjectSettings
}

export interface EstimationResult {
  id: string
  projectName: string
  method: EstimationMethod
  buildingType: BuildingType
  currency: Currency
  area: number
  floors: number
  date: string
  items: MaterialItem[]
  summary: CostSummary
  settings: ProjectSettings
  rooms?: Room[]
}

export interface AppStore {
  // Material rates
  materialRates: Record<string, number>
  setMaterialRate: (material: string, rate: number) => void
  resetMaterialRates: () => void

  // Settings
  settings: ProjectSettings
  updateSettings: (settings: Partial<ProjectSettings>) => void

  // Results
  currentResult: EstimationResult | null
  results: EstimationResult[]
  setCurrentResult: (result: EstimationResult) => void
  clearCurrentResult: () => void

  // Rooms for layout method
  rooms: Room[]
  addRoom: (room?: Partial<Room>) => void
  updateRoom: (id: string, updates: Partial<Room>) => void
  deleteRoom: (id: string) => void
  resetRooms: () => void

  // Currency
  currency: Currency
  setCurrency: (currency: Currency) => void
}
