import { api } from "../../utils/api"

export const useGetAllClimbers = () => {
  return api.climber.getAll.useQuery()
}
