import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  position?: string | undefined,
}

const SignOutButton = ({ position }: SignOutButtonProps) => {
  const defaultStyling = 'rounded-md bg-red-900 transition p-2 shadow-md shadow-neutral-900 hover:scale-95 ease-out';

  return (
    <button
      onClick={() => signOut()}
      className={position ? `${position} ${defaultStyling}` : defaultStyling }
    >
      Log Out
      <ArrowRightOnRectangleIcon className='h-5 w-5 inline ml-1 mb-1' />
    </button>
  )
}

export default SignOutButton
