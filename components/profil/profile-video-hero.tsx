"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Maximize, Play, Volume2 } from "lucide-react"

interface ProfileVideoHeroProps {
  eyebrow: string
  title: string
  description: string
}

const videoSource = "/videos/pesona-potensi-desa.mp4"
const posterSource = "/images/pesona-potensi-desa-poster.jpg"

export function ProfileVideoHero({ eyebrow, title, description }: ProfileVideoHeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideoError, setHasVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const resumeAmbientPlayback = () => {
      if (document.fullscreenElement) return

      video.controls = false
      video.muted = true
      video.loop = true
      void video.play().catch(() => undefined)
    }

    document.addEventListener("fullscreenchange", resumeAmbientPlayback)
    return () => document.removeEventListener("fullscreenchange", resumeAmbientPlayback)
  }, [])

  useLayoutEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .from(".profile-video-hero-media", { autoAlpha: 0.6, scale: 1.08, duration: 1.25 })
          .from(".profile-video-hero-copy > p, .profile-video-hero-copy > h1", { autoAlpha: 0, y: 26, duration: 0.72, stagger: 0.12 }, "-=0.7")
      }, rootRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  const watchWithSound = async () => {
    const video = videoRef.current
    if (!video || hasVideoError) return

    video.muted = false
    video.volume = 1
    video.loop = false
    video.controls = true
    video.currentTime = 0

    try {
      await video.play()

      if (video.requestFullscreen) {
        await video.requestFullscreen()
      } else {
        const safariVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
        safariVideo.webkitEnterFullscreen?.()
      }
    } catch {
      // Native controls remain available if fullscreen playback is unavailable.
    }
  }

  return (
    <header ref={rootRef} className="relative -mt-[88px] flex min-h-[500px] items-center overflow-hidden bg-[#071b1d] px-4 pb-12 pt-[136px] text-white sm:min-h-[600px] sm:px-5 sm:pb-20 sm:pt-[168px] lg:min-h-[640px]">
      {hasVideoError ? (
        <img src={posterSource} alt="Pemandangan Desa Kedungrejo" className="profile-video-hero-media absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-[60%_center]" />
      ) : (
        <video
          ref={videoRef}
          className="profile-video-hero-media absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-[60%_center]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSource}
          aria-hidden="true"
          onError={() => setHasVideoError(true)}
        >
          <source src={videoSource} type="video/mp4" />
          Browser Anda belum mendukung pemutaran video.
        </video>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,15,0.82),rgba(8,34,23,0.62),rgba(8,36,19,0.48)),linear-gradient(180deg,rgba(5,24,18,0.26),rgba(5,24,18,0.34)_42%,rgba(5,24,18,0.76))]" />

      <div className="profile-video-hero-copy relative mx-auto w-full max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 sm:text-sm sm:tracking-[0.2em]">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight sm:mt-4 sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:mt-5 sm:text-lg sm:leading-8">{description}</p>

        <button
          type="button"
          onClick={watchWithSound}
          disabled={hasVideoError}
          className="mt-7 inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-white/25 bg-white/12 px-4 py-3.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60 min-[420px]:w-auto min-[420px]:justify-start sm:mt-8 sm:px-5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-emerald-950">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          </span>
          <span className="flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5"><Volume2 className="h-4 w-4" aria-hidden="true" /> Lihat video full</span>
            <span className="mt-0.5 text-xs font-medium text-white/75">Putar dengan suara</span>
          </span>
          <Maximize className="ml-1 h-4 w-4 text-white/80" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
