import type { STATUS_LABEL } from "@/lib/service-status"

export type ServiceRequirement = { id?: string; title: string; isRequired?: boolean; order?: number }
export type VillageService = { id: string; slug: string; title: string; description: string; icon: string; estimatedTime: string; isActive: boolean; order: number; requirements: ServiceRequirement[] }
export type ServiceDraft = Omit<VillageService, "id">
export type ServiceSubmission = { id: string; trackingCode: string; fullName: string; nationalId: string; address: string; whatsapp: string; purpose: string; status: keyof typeof STATUS_LABEL; statusLabel: string; createdAt: string; service: { title: string }; attachments: { id: string; filename: string }[]; history: { note: string | null }[] }

export const createServiceDraft = (): ServiceDraft => ({ slug: "", title: "", description: "", icon: "description", estimatedTime: "1-2 hari kerja", isActive: true, order: 0, requirements: [{ title: "KTP" }, { title: "Kartu Keluarga" }] })
export const isSavedService = (service: VillageService | ServiceDraft): service is VillageService => "id" in service
