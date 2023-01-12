import { signIn } from 'next-auth/react'

const LogInPrompt = () => {
  return (
    <div>
      <h1 className='p-2 text-4xl'>FA Youth Rec Management</h1>
      <button
        onClick={() => signIn('google')}
        className='m-2 rounded-md bg-gray-800 p-2 motion-safe:hover:scale-95 transition duration-150 ease-in-out'
      >
        Sign In with Google
      </button>
      <button
        onClick={() => signIn('discord')}
        className='m-2 rounded-md bg-gray-800 p-2 motion-safe:hover:scale-95 transition duration-150 ease-in-out'
      >
        Sign In with Discord
      </button>

    </div>
  )
}

export default LogInPrompt
