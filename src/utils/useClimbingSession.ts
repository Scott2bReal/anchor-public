import { useAtom } from "jotai"
import { sessionAtom } from "./atoms/sessionAtom"
import { trpc } from "./trpc"

const useClimbingSession = () => {
  const {data: current} = trpc.climbingSession.getCurrent.useQuery()
  const [selectedSession] = useAtom(sessionAtom)

  return selectedSession ?? current
}

export default useClimbingSession
