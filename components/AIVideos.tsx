'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { getYouTubeVideoId } from '@/lib/youtube'

type AIVideo = {
  title: string
  type: 'Story' | 'High Retention' | 'Ultra Realistic Ads' | 'Cartoon'
  url: string
}

const aiVideos: readonly AIVideo[] = [
  ...['7uHJ9H7OdB8', 'zfXz2QNDdR0', 'Gke3twjPPiE', 'SuUFMun3NBg', 'wiyVQ85TxhE', 'drVXyXp7ovo'].map((id, index) => ({ title: `Story ${String(index + 1).padStart(2, '0')}`, type: 'Story' as const, url: `https://youtube.com/shorts/${id}` })),
  ...['DBAV968vhmg', 'Kmz8_dEllZU', 'Rp3DJABwGZE', 'c2eVWGA8S_0'].map((id, index) => ({ title: `High Retention ${String(index + 1).padStart(2, '0')}`, type: 'High Retention' as const, url: `https://youtube.com/shorts/${id}` })),
  ...['D5jzeuSnWsM', 'uJb7dq_PWnU', 'eZjEnhg3Elo', 'QTx9A78fgqg', 'zdYFd4bNLb8', 'slWSBOyxk18'].map((id, index) => ({ title: `Ultra Realistic Ad ${String(index + 1).padStart(2, '0')}`, type: 'Ultra Realistic Ads' as const, url: `https://youtube.com/shorts/${id}` })),
  { title: 'Cartoon', type: 'Cartoon', url: 'https://youtube.com/shorts/_fiVPyVZLw4' },
  { title: 'Standup', type: 'Cartoon', url: 'https://youtube.com/shorts/X6zqPGa9uok' },
] as const

function getThumbnailUrls(videoId: string): string[] {
  return [
    `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  ]
}

function AIVideoCard({ video, index }: { video: AIVideo; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const videoId = getYouTubeVideoId(video.url)
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1` : null
  const isShort = true

  useEffect(() => {
    let isMounted = true

    if (!videoId) return

    const thumbnails = getThumbnailUrls(videoId)
    let index = 0

    const loadThumbnail = () => {
      const candidate = thumbnails[index]
      if (!candidate) return

      const image = new window.Image()
      image.onload = () => {
        if (isMounted) setThumbnail(candidate)
      }
      image.onerror = () => {
        index += 1
        loadThumbnail()
      }
      image.src = candidate
    }

    loadThumbnail()

    return () => {
      isMounted = false
    }
  }, [videoId])

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:backdrop-blur"
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-neutral-200/70 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black dark:border-white/10 ${
          isShort ? 'aspect-[9/14]' : 'aspect-video'
        }`}
      >
        {isPlaying && embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${video.title} player`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : thumbnail ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[size:14px_14px] opacity-35" />
        )}

        {!isPlaying && videoId ? (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
          >
            <span className="rounded-full border border-white/60 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              Play
            </span>
          </button>
        ) : null}

        {isPlaying && videoId ? (
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            aria-label={`Stop ${video.title}`}
            className="absolute right-3 top-3 z-20 rounded-full border border-white/50 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
          >
            Stop
          </button>
        ) : null}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-white/85">
          <span>{video.type}</span>
          <span>AI Video</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white">{video.title}</h3>
        {!isShort ? (
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            YouTube {video.type.toLowerCase()} edit focused on AI content pacing and retention.
          </p>
        ) : null}
      </div>
    </motion.article>
  )
}

export default function AIVideos() {
  return (
    <section className="mx-auto max-w-5xl py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-neutral-950/5 px-3 py-1.5 text-sm text-neutral-700 dark:bg-white/5 dark:text-neutral-200">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            AI videos.
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            AI-assisted stories, high-retention edits, and ads made for short-form viewing.
          </p>
        </div>
      </div>

      {(['Ultra Realistic Ads', 'Story', 'High Retention', 'Cartoon'] as const).map((category) => (
        <div className="mt-8" key={category}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{category}</h3>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {aiVideos.filter((video) => video.type === category).map((video, index) => (
              <AIVideoCard key={video.url} video={video} index={index} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
