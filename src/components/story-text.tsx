"use client"

import { motion } from "framer-motion"
import { useState } from "react"

type Line = {
  text: string
  score?: number
  createdBy?: {
    name?: string
    image?: string
  }
}

const StoryText = ({ lines }: { lines: Line[] }) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    content: React.ReactNode
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  })

  const handleMouseEnter = (e: React.MouseEvent, line: Line) => {
    const content = (
      <div className="flex items-center gap-2 whitespace-nowrap">
        {line.createdBy?.name && (
          <span className="font-semibold">{line.createdBy.name}</span>
        )}
        {line.score !== undefined && (
          <span className="text-yellow-400">Score: {line.score}</span>
        )}
      </div>
    )
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      content,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
    }))
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  return (
    <section className="my-10">
      <div className="max-w-4xl">
        <div className="text-2xl leading-relaxed text-neutral-600">
          {lines?.map((line, index) => {
            const hasTooltip = line.createdBy?.name || line.score !== undefined
            return (
              <span
                key={index}
                className="relative inline cursor-default rounded-md px-[2px] hover:bg-amber-200"
                onMouseEnter={
                  hasTooltip ? (e) => handleMouseEnter(e, line) : undefined
                }
                onMouseMove={hasTooltip ? handleMouseMove : undefined}
                onMouseLeave={hasTooltip ? handleMouseLeave : undefined}
              >
                {line.text + (index !== lines.length - 1 ? " " : "")}
              </span>
            )
          })}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: tooltip.y + 12,
            left: tooltip.x + 12,
            pointerEvents: "none",
            zIndex: 1000,
            whiteSpace: "nowrap",
          }}
          className="rounded-md bg-neutral-800 px-3 py-1 text-xs text-white shadow-lg"
        >
          {tooltip.content}
        </motion.div>
      )}
    </section>
  )
}

export default StoryText
