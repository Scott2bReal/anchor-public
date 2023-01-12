import { User } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { CloseThisWindowButton } from "./ClassInfo"
import LoadingSpinner from "./LoadingSpinner"
import SignOutButton from "./SignOutButton"
import { UserSetDefaultSessionMenu } from "./UserSetDefaultSessionMenu";
import { UserShowCampToggle } from "./UserShowCampToggle";

interface Props {
  onRequestClose: () => void;
  user: User
}

export const UserControls = ({ onRequestClose, user }: Props) => {
  const {data: sessions, isLoading: sessionsLoading} = trpc.climbingSession.getAll.useQuery()

  if (sessionsLoading) return <LoadingSpinner />
  if (!sessions || !sessions[0]) return <div>No sessions found</div>

  const defaultSession = sessions.find(session => session.id === user.defaultSessionId) ?? sessions[0]

  return <div className='flex flex-col gap-2'>
    <h1 className='text-3xl font-bold'>Control Panel</h1>
    <section className=''>
      <h2 className='text-xl font-bold'>Set Default Session</h2>
      <UserSetDefaultSessionMenu initialDefault={defaultSession} user={user} />
    </section>
    <section>
      <h2 className='text-xl font-bold'>Show Camp Link</h2>
      <UserShowCampToggle user={user} />
    </section>
    <SignOutButton />
    <CloseThisWindowButton closeFunction={onRequestClose} />
  </div>
}
