import Image from "next/image"

export function LoginBrand() {
  return (
    <aside className="login-brand relative flex min-h-[230px] items-center overflow-hidden bg-[#0f4d3e] p-6 text-white sm:min-h-72 sm:p-10 lg:p-12" aria-labelledby="login-brand-title">
      <div className="login-ring absolute -right-20 -top-24 h-64 w-64 rounded-full border-[28px] border-white/10" aria-hidden="true" />
      <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-emerald-300/10" aria-hidden="true" />
      <div className="relative max-w-sm">
        <div className="login-logo flex h-16 w-[46px] items-center justify-center sm:h-20 sm:w-[57px]">
          <Image src="/images/logokedungrejo.png" alt="Lambang Desa Kedungrejo" width={57} height={80} className="h-auto w-full" preload sizes="57px" />
        </div>
        <p className="login-copy mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200 sm:mt-8 sm:text-xs sm:tracking-[0.2em]">Desa Kedungrejo</p>
        <h1 id="login-brand-title" className="login-copy mt-2 text-2xl font-black tracking-tight sm:mt-3 sm:text-4xl">CMS Administrasi Desa</h1>
        <p className="login-copy mt-3 text-sm leading-6 text-emerald-50/85 sm:mt-4 sm:text-base sm:leading-7">Akses khusus perangkat desa yang berwenang.</p>
      </div>
    </aside>
  )
}
