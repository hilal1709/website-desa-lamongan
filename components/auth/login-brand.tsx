import Image from "next/image"

export function LoginBrand() {
  return (
    <aside className="login-brand relative flex min-h-[230px] items-center overflow-hidden bg-[#0f4d3e] p-6 text-white sm:min-h-72 sm:p-10 lg:p-12" aria-labelledby="login-brand-title">
      <div className="login-ring absolute -right-20 -top-24 h-64 w-64 rounded-full border-[28px] border-white/10" aria-hidden="true" />
      <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-emerald-300/10" aria-hidden="true" />
      <div className="relative max-w-sm">
        <div className="login-logo flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-lg shadow-emerald-950/20 sm:h-16 sm:w-16">
          <Image src="/images/logokedungrejo.jpeg" alt="Lambang Desa Kedungrejo" width={48} height={48} className="h-full w-full rounded-xl object-cover" priority sizes="48px" />
        </div>
        <p className="login-copy mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200 sm:mt-8 sm:text-xs sm:tracking-[0.2em]">Desa Kedungrejo</p>
        <h1 id="login-brand-title" className="login-copy mt-2 text-2xl font-black tracking-tight sm:mt-3 sm:text-4xl">CMS Administrasi Desa</h1>
        <p className="login-copy mt-3 text-sm leading-6 text-emerald-50/85 sm:mt-4 sm:text-base sm:leading-7">Akses khusus perangkat desa yang berwenang.</p>
      </div>
    </aside>
  )
}
