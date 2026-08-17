interface EmptyNewsStateProps {
  title?: string
  description?: string
}

export function EmptyNewsState({
  title = "Belum ada berita",
  description = "Berita terbaru dari Desa Kedungrejo akan segera hadir di halaman ini.",
}: EmptyNewsStateProps) {
  return (
    <div className="news-empty-state mx-auto max-w-xl rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center sm:px-6 sm:py-14">
      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  )
}
