export type Variant = { name: string; price: number }
export type Product = { id: string; name: string; description: string; imageUrl: string; price: number; variants?: Variant[]; isAvailable: boolean }
export type Business = { id: string; name: string; slug: string; category: string; description: string; logoUrl: string; whatsapp: string; address: string | null; dusun: string; registeredAt: string; isPublished: boolean; products: Product[] }
export type ApiProduct = Omit<Product, "variants"> & { variants?: unknown }
export type ApiBusiness = Omit<Business, "dusun" | "registeredAt" | "products"> & { products: ApiProduct[]; dusun?: string | null; registeredAt?: string | Date | null; createdAt?: string | Date | null }
export type ProfileForm = Omit<Business, "id" | "products"> & { id?: string }
export type ProductForm = Omit<Product, "id"> & { id?: string }
