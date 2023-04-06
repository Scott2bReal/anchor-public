import { api } from "../../utils/api"

export const useGetSessionById = (id: string) => {
  return api.climbingSession.getById.useQuery({ id: id })
}
