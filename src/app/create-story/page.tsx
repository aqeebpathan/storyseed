import StoryForm from "@/components/story-form"
import { auth } from "../auth"
import { redirect } from "next/navigation"

const CreateStoryPage = async () => {
  const session = await auth()
  if (!session?.user?.email?.startsWith("stackwithsynergy")) {
    redirect("/")
  }
  return (
    <section className="px-4">
      <h1 className="my-4 text-xl">Create a New Story</h1>
      <StoryForm />
    </section>
  )
}

export default CreateStoryPage
