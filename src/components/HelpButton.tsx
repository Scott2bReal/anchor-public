import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
// import Link from "next/link"
import { useRouter } from 'next/router'

const HelpButton = () => {
  const info = useRouter().pathname

  if (!info)
    return (
      <QuestionMarkCircleIcon className='absolute top-6 right-6 z-[6] h-6 w-6 transition ease-in-out hover:scale-125 hover:cursor-pointer' />
    )

  return (
    <QuestionMarkCircleIcon className='absolute top-6 right-6 z-[6] h-6 w-6 transition ease-in-out hover:scale-125 hover:cursor-pointer' />
  )
}

export default HelpButton
