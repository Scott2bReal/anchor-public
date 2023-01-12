import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { gymAtom } from '../utils/atoms/gymAtom'
import capitalize from '../utils/capitalize'
import { trpc } from '../utils/trpc'
import ClimberInfo from './ClimberInfo'
import LoadingSpinner from './LoadingSpinner'
import Search from './Search'
import SessionSelector from './SessionSelector'
import { UserControlsButton } from './UserControlsButton'

const SideNav = () => {
  const { data: session } = useSession()
  const [selectedGymId] = useAtom(gymAtom)
  const { data: selectedGym } = trpc.gyms.getForSideNav.useQuery({ id: selectedGymId })
  const pathname = useRouter().asPath
  const { data: user, isLoading: userLoading } = trpc.user.getCurrent.useQuery()

  const bgColor = selectedGym ? selectedGym.cssCode : 'bg-gray-700'

  const links: string[] = ['schedule', 'waitlist', 'offers', 'camp']

  if (userLoading || !user) return <LoadingSpinner />

  const unselectedStyle =
    'block rounded py-2.5 px-4 w-full text-center transition duration-150 hover:bg-gray-700 hover:text-white'
  const selectedStyle =
    `block rounded py-2.5 px-4 w-full text-center transition duration-150 ${bgColor} hover:text-white transition-colors duration-500 ease-in-out`


  // Mobile Bar height === 64px
  return session ? (
    // Sidebar
    // TODO Add button to hide even when widescreen?
    <div
      className={`sidebar fixed inset-y-0 top-[64px] left-0 z-[1] flex h-[calc(100vh-64px)] w-64 -translate-x-full transform flex-col
        space-y-6 bg-gray-800 px-2 py-7 text-lg text-gray-100 transition
        duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0`}
    >
      <SessionSelector user={user} />

      {/* Navbar */}
      <div className='flex h-full flex-col justify-between'>
        <nav className='flex flex-col items-center'>
          {
            links.map(link => {
              if (link === 'camp' && !user.showCamp) return <></>;
              return (
                <Link key={link} href={`/${link}/`}>
                  <a
                    className={
                      pathname === `/${link}` ? selectedStyle : unselectedStyle
                    }
                  >
                    {capitalize(link)}
                  </a>
                </Link>
              )
            })
          }
          <Search />
          <ClimberInfo />
        </nav>
        <UserControlsButton user={user} />

      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default SideNav
