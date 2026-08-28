import type { ApiBusiness, ApiProduct, Business, Product, ProductForm, ProfileForm, Variant } from "./umkm-types"

export const today = () => new Date().toISOString().slice(0, 10)
export const dateInput = (value: unknown) => value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" && !Number.isNaN(Date.parse(value)) ? value.slice(0, 10) : today()
export const makeSlug = (value: string) => value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
export const emptyProfile = (): ProfileForm => ({ name: "", slug: "", category: "", description: "", logoUrl: "", whatsapp: "", address: "", dusun: "", registeredAt: today(), isPublished: true })
export const emptyProduct = (): ProductForm => ({ name: "", description: "", imageUrl: "", price: 0, variants: [], isAvailable: true })
export const normalizeProduct = (product: ApiProduct): Product => ({ ...product, variants: Array.isArray(product.variants) ? (product.variants as unknown[]).flatMap((variant) => typeof variant === "string" ? [{ name: variant, price: product.price }] : variant && typeof variant === "object" && typeof (variant as Variant).name === "string" && Number.isFinite((variant as Variant).price) ? [{ name: (variant as Variant).name, price: (variant as Variant).price }] : []) : [] })
export const normalizeBusiness = (business: ApiBusiness): Business => ({ ...business, products: business.products.map(normalizeProduct), dusun: business.dusun?.trim() || "Belum ditentukan", registeredAt: dateInput(business.registeredAt ?? business.createdAt) })

export async function readResponse<T>(response: Response): Promise<T & { message?: string }> {
  const body = await response.text()
  if (!body) return { message: "Server tidak mengirim respons. Silakan coba lagi." } as T & { message?: string }
  try { return JSON.parse(body) as T & { message?: string } } catch { return { message: "Respons server tidak valid. Silakan coba lagi." } as T & { message?: string } }
}
