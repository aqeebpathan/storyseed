import StoryText from "@/components/story-text"
import AddLineForm from "@/components/add-line-form"

type Story = {
  title: string
  genre?: string
  lines: {
    text: string
    score?: number
    createdBy?: {
      name?: string
      image?: string
    }
  }[]
}

type PageProps = {
  params: {
    slug: string
  }
}

const StoryPage = async ({ params }: PageProps) => {
  const { slug } = params

  const res = await fetch(`${process.env.BASE_URL}/api/stories/${slug}`, {
    cache: "no-store",
    next: { revalidate: 20 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch story")
  }

  const story: Story = await res.json()

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-100px)] w-full flex-col px-4 py-12">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-neutral-700">{story.title}</h1>
        {story.genre && (
          <p className="mt-1 text-lg text-neutral-400">{story.genre}</p>
        )}
        <StoryText lines={story.lines} />
      </div>

      <AddLineForm />
    </div>
  )
}

export default StoryPage
