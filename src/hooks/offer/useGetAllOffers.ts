import { api } from "../../utils/api"

export const useGetAllOffers = () => {
  return api.offer.getAll.useQuery()
}
