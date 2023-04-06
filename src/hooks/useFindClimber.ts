import { api } from "../utils/api"

const useFindClimber = (climberId: string | null) => {
  return api.climber.getById.useQuery({ id: climberId })
}

export default useFindClimber
