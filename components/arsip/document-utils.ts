export function categoryFromMeta(meta: string) {
  return meta.split(" - ")[0] ?? "Dokumen lain"
}
