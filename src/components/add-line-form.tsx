"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"

const AddLineForm = () => {
  const [focused, setFocused] = useState(false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const maxLength = 200
  const isActive = focused || text.trim().length > 0

  const { slug } = useParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/stories/${slug}/lines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        alert("Error: " + error)
      } else {
        const { line, score } = await res.json()
        console.log("Posted:", line, "Score:", score)
        setText("")
        setFocused(false)
      }
    } catch (err) {
      console.error("Submission failed", err)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full px-4">
      <motion.div
        animate={{
          height: isActive ? 175 : 70,
          backgroundColor: isActive ? "#404040" : "#ffffff",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="mx-auto w-full max-w-7xl rounded-t-2xl p-4 ring ring-neutral-400"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex h-full items-start gap-4">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                isActive ? "bg-white" : "bg-neutral-100"
              } text-3xl font-light text-neutral-400 transition-colors`}
            >
              <span className="-mt-1">+</span>
            </div>

            <div className="flex w-full flex-col">
              <textarea
                maxLength={maxLength}
                placeholder="What's your line?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  if (!text.trim()) setFocused(false)
                }}
                className="mt-1 w-full resize-none bg-transparent text-2xl leading-snug text-white placeholder:text-neutral-400 focus:outline-none"
              />

              {/* Character Counter */}
              <div className="mt-1 flex justify-end text-sm text-neutral-200">
                {text.length}/{maxLength}
              </div>
            </div>
          </div>

          {/* Submit button */}
          {isActive && (
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-lg bg-neutral-100 px-4 py-2 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-60"
              >
                {loading ? "Adding..." : "Add Line"}
              </button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  )
}

export default AddLineForm
