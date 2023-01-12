import { trpc } from "../utils/trpc"

const useFindClimber = (climberId: string | null) => {
  return trpc.climber.getById.useQuery({ id: climberId })
}

export default useFindClimber
