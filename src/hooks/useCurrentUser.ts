import { api } from "../utils/api"

export const useCurrentUser = () => {
  return api.user.getCurrent.useQuery()
}
