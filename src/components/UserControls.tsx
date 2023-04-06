import type { User } from '@prisma/client'
import { useAtom } from 'jotai'
import { api } from '../utils/api'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import { CloseThisWindowButton } from './ClassInfo'
import { ExportSession } from './ExportSession'
import LoadingSpinner from './LoadingSpinner'
import SignOutButton from './SignOutButton'
import { UserSetDefaultSessionMenu } from './UserSetDefaultSessionMenu'

interface Props {
  onRequestClose: () => void
  user: User
}

export const UserControls = ({ onRequestClose, user }: Props) => {
  const { data: sessions, isLoading: sessionsLoading } =
    api.climbingSession.getAll.useQuery()
  const [selectedSession] = useAtom(sessionAtom)

  if (sessionsLoading) return <LoadingSpinner />
  if (!sessions || !sessions[0] || !selectedSession)
    return <div>No sessions found</div>

  const defaultSession =
    sessions.find((session) => session.id === user.defaultSessionId) ??
    sessions[0]

  return (
    <div className='flex h-[80vh] w-[80vw] flex-col justify-between gap-2 lg:w-[50vw]'>
      <div>
        <h1 className='p-6 text-3xl font-bold'>Control Panel</h1>
        <div className='flex justify-evenly'>
          <div className='text-center'>
            <h2 className='text-xl font-bold'>Set Your Default Session</h2>
            <h3>The one the app loads by default</h3>
            <UserSetDefaultSessionMenu
              initialDefault={defaultSession}
              user={user}
            />
          </div>
          <div className='text-center'>
            <h2 className='pb-2 text-xl font-bold'>{`Export ${selectedSession.name} ${selectedSession.year} Data`}</h2>
            <ExportSession />
          </div>
        </div>
      </div>
      <div className='flex justify-between '>
        <SignOutButton />
        <CloseThisWindowButton
          cancelCenter={true}
          closeFunction={onRequestClose}
        />
      </div>
    </div>
  )
}
