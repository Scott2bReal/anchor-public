import { useAtom } from "jotai"
import { api } from "../utils/api"
import { sessionAtom } from "../utils/atoms/sessionAtom"

const useClimbingSession = () => {
  const {data: current} = api.climbingSession.getCurrent.useQuery()
  const [selectedSession] = useAtom(sessionAtom)

  return selectedSession ?? current
}

export default useClimbingSession
