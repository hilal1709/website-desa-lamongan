export type Disease = { id: string; diseaseName: string; normalizedName: string; startedAt: string }
export type DiseaseHistory = { id: string; diseaseName: string; startedAt: string; endedAt: string | null }
export type Check = { id: string; recordedAt: string; updatedAt: string; systolic: number; diastolic: number; weightKg: number; heightCm: number; bloodGlucoseMgDl: number; notes: string | null }
export type Elderly = { id: string; fullName: string; dusun: string; birthDate: string; address: string; isActive: boolean; diseases: Disease[]; diseaseHistory: DiseaseHistory[]; checks: Check[] }
export type Session = { id: string; name: string; sessionDate: string; createdBy: { name: string | null; username: string }; _count: { checks: number } }
export type Pagination = { page: number; pageSize: number; totalItems: number; totalPages: number }
export type Dashboard = { metrics: { totalElderly: number; checkedElderly: number; attendanceRate: number; sessionCount: number }; diseaseTop: { label: string; total: number }[]; diseaseDusun: { disease: string; total: number; dusun: Record<string, number> }[]; sessionAttendance: { id: string; name: string; date: string; checked: number; total: number }[]; measurementTrend: { month: string; systolic: number; diastolic: number; weightKg: number; heightCm: number; bloodGlucoseMgDl: number }[] }
