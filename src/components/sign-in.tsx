import { signIn } from "@/app/auth"

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button type="submit" className="cursor-pointer text-lg">
        Signin
      </button>
    </form>
  )
}
