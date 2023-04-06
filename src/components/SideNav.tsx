import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGetCampYear } from '../hooks/camp/useGetCampYear'
import { api } from '../utils/api'
import { campYearAtom } from '../utils/atoms/campYearAtom'
import { gymAtom } from '../utils/atoms/gymAtom'
import capitalize from '../utils/capitalize'
import { CampYearSelector } from './CampYearSelector'
import ClimberInfo from './ClimberInfo'
import LoadingSpinner from './LoadingSpinner'
import Search from './Search'
import SessionSelector from './SessionSelector'
import { UserControlsButton } from './UserControlsButton'
import { UserShowCampToggle } from './UserShowCampToggle'

const SideNav = () => {
  const { data: session } = useSession()
  const [selectedGymId] = useAtom(gymAtom)
  const { data: selectedGym } = api.gym.getForSideNav.useQuery({
    id: selectedGymId,
  })
  const pathname = useRouter().asPath
  const { data: user, isLoading: userLoading } = api.user.getCurrent.useQuery()
  const [selectedYear] = useAtom(campYearAtom)
  const { data: currentYear, isLoading: currentYearLoading } =
    useGetCampYear(selectedYear)

  const bgColor = selectedGym ? selectedGym.cssCode : 'bg-gray-700'

  const links: string[] = ['schedule', 'waitlist', 'offers']

  if (userLoading || currentYearLoading) return <LoadingSpinner />
  if (!user || !currentYear)
    return <div>Couldn&apos;t find user or camp year</div>
  const showCamp = user.showCamp

  const unselectedStyle = `block rounded py-2.5 px-4 w-full text-center transition duration-150 hover:bg-gray-700 hover:text-white`
  const selectedStyle = `block rounded py-2.5 px-4 w-full text-center transition duration-150 ${bgColor} transition-colors duration-500 ease-in-out`

  // Mobile Bar height === 64px
  return session ? (
    // Sidebar
    // TODO Add button to hide even when widescreen?
    <div
      className={`sidebar fixed inset-y-0 top-[64px] left-0 z-[3] flex h-[100vh] w-64 -translate-x-full transform flex-col
        space-y-6 bg-gray-800 px-2 py-7 text-lg text-gray-100 transition
        duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0`}
    >
      {user.showCamp ? <CampYearSelector /> : <SessionSelector user={user} />}

      <div className='p-2 text-center'>
        <span className='text-2xl'>🏕️</span>
        <UserShowCampToggle user={user} />
      </div>

      {/* Navbar */}
      <div className='flex h-full flex-col justify-between'>
        <nav className='flex flex-col items-center'>
          {links.map((link) => {
            return (
              <Link
                key={link}
                href={showCamp ? `/camp/${link}/` : `/${link}`}
                className={
                  showCamp
                    ? pathname === `/camp/${link}`
                      ? selectedStyle
                      : unselectedStyle
                    : pathname === `/${link}`
                    ? selectedStyle
                    : unselectedStyle
                }
              >
                {capitalize(link)}
              </Link>
            )
          })}
          <Search />
          <ClimberInfo />
        </nav>
        <div className='mx-auto w-full text-center'>
          <UserControlsButton user={user} />
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default SideNav
