import Link from "next/link"
import SignIn from "./sign-in"
import { auth } from "@/app/auth"

const Navbar = async () => {
  const session = await auth()
  return (
    <nav className="mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <span className="text-3xl tracking-tight">Storyseed</span>
        </Link>

        {session ? <div>{session.user?.name}</div> : <SignIn />}
      </div>
    </nav>
  )
}

export default Navbar
