import StoryCard from "./story-card"

type Story = {
  _id: string
  slug: string
  title: string
  genre?: string
  lines: { text: string }[]
}

const StoryShowcase = async () => {
  const data = await fetch(`${process.env.BASE_URL}/api/stories`, {
    cache: "no-store",
  })

  if (!data.ok) {
    throw new Error("Failed to fetch stories")
  }

  const stories: Story[] = await data.json()

  return (
    <section className="my-24">
      <div className="mb-16 text-center text-xl leading-normal sm:mb-24">
        <h2 className="font-medium">Which story will you twist today?</h2>
        <p className="mt-1 text-neutral-400">
          Read a tale in progress. Add your next line...
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
        {stories?.map((story, i) => (
          <StoryCard key={story._id} story={story} index={i} />
        ))}
      </div>
    </section>
  )
}

export default StoryShowcase
