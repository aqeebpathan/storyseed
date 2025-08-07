"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

type FormData = {
  title: string
  genre?: string
  firstLine: string
}

export default function StoryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    setLoading(false)

    if (res.ok) {
      router.push(`/story/${result.slug}`)
    } else {
      alert(result.error || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <div>
        <input
          type="text"
          placeholder="Story title"
          {...register("title", { required: "Title is required" })}
          className="w-full rounded-lg border p-2 focus:ring focus:outline-none"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Genre (optional)"
          {...register("genre")}
          className="w-full rounded-lg border p-2 focus:ring focus:outline-none"
        />
      </div>

      <div>
        <textarea
          placeholder="First line of the story (max 150 characters)"
          maxLength={150}
          {...register("firstLine", {
            required: "First line is required",
            maxLength: {
              value: 150,
              message: "First line must be 150 characters or less",
            },
          })}
          className="w-full rounded-lg border p-2 focus:ring focus:outline-none"
        />
        {errors.firstLine && (
          <p className="text-sm text-red-500">{errors.firstLine.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        {loading ? "Creating..." : "Create Story"}
      </button>
    </form>
  )
}
