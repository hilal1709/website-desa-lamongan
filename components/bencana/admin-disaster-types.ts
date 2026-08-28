export type LocationType = "EVAKUASI" | "RAWAN" | "POSKO"
export type DisasterStatus = "auto" | "aman" | "waspada" | "bahaya"
export type DisasterLocation = { id: string; name: string; description: string | null; type: LocationType; latitude: number; longitude: number; isActive: boolean }
export type LocationDraft = Omit<DisasterLocation, "id"> & { id?: string }
export type AdminDisasterData = { setting: { override: DisasterStatus; announcement: string | null }; locations: DisasterLocation[] }

export const locationsPerPage = 5
export const typeLabels: Record<LocationType, string> = { EVAKUASI: "Titik evakuasi", RAWAN: "Zona rawan", POSKO: "Posko" }
export const emptyLocation = (): LocationDraft => ({ name: "", description: "", type: "POSKO", latitude: -7.1571, longitude: 112.1593, isActive: true })
