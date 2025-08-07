const Footer = () => {
  return (
    <footer className="mx-auto my-8 flex w-full flex-col items-center justify-between px-4 text-neutral-400 sm:flex-row">
      <p>Built by storytellers, for storytellers.</p>
      <div className="space-x-2 sm:space-x-4">
        <a href="" className="transition-colors hover:text-neutral-800">
          {" "}
          GitHub
        </a>
        <a href="" className="transition-colors hover:text-neutral-800">
          {" "}
          Feedback
        </a>
      </div>
    </footer>
  )
}

export default Footer
