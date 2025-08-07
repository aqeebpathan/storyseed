"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface StoryCardProps {
  story: {
    _id: string
    slug: string
    title: string
    genre?: string
    lines: { text: string }[]
  }
  index: number
}

const cardTransforms = [
  { y: 20, rotate: -2 },
  { y: -10, rotate: 1 },
  { y: 15, rotate: -1.5 },
  { y: -5, rotate: 2 },
]

const StoryCard = ({ story, index }: StoryCardProps) => {
  const { _id, title, lines, genre, slug } = story
  const transform = cardTransforms[index % cardTransforms.length]

  return (
    <Link href={`/story/${slug}`}>
      <motion.article
        key={_id}
        initial={{ opacity: 0, y: 50, scale: 0.85 }}
        animate={{
          opacity: 1,
          y: transform.y,
          scale: 1,
          rotate: transform.rotate,
        }}
        transition={{
          delay: index * 0.15,
          duration: 0.6,
          ease: [0.25, 0.8, 0.25, 1],
        }}
        className="group flex h-52 w-40 cursor-default flex-col rounded-3xl border p-4 ring-neutral-500 transition-transform hover:scale-110 sm:w-46"
      >
        {/* Index bubble and genre */}
        <div className="flex items-center justify-between">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800">
            <span className="leading-tight tracking-tighter text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="text-sm font-semibold italic opacity-0 transition-opacity group-hover:opacity-100">
            {genre}
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-lg leading-tight font-semibold tracking-tight">
          {title}
        </h1>

        {/* Preview Text */}
        <p className="clamp-text mt-2 flex-1 overflow-hidden leading-tight font-medium text-neutral-400/80">
          {lines[0]?.text}
        </p>
      </motion.article>
    </Link>
  )
}

export default StoryCard
