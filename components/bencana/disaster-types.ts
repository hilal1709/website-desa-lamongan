export type DisasterRiskLevel = "aman" | "waspada" | "bahaya"

export type DisasterWeatherUpdate = {
  risk: DisasterRiskLevel
  precipitationToday: number
  weatherCode: number
}

export type DisasterLocation = {
  id: string
  name: string
  description: string | null
  type: "EVAKUASI" | "RAWAN" | "POSKO"
  latitude: number
  longitude: number
}
