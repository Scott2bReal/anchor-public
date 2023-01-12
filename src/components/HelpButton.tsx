import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid"
// import Link from "next/link"
import { useRouter } from "next/router"

const HelpButton = () => {
  const info = useRouter().pathname

  if (!info) return <QuestionMarkCircleIcon className="z-[6] h-6 w-6 absolute top-6 right-6 hover:cursor-pointer hover:scale-125 transition ease-in-out" />

  return (
    <QuestionMarkCircleIcon className="z-[6] h-6 w-6 absolute top-6 right-6 hover:cursor-pointer hover:scale-125 transition ease-in-out" />
  )
}

export default HelpButton
