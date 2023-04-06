import { api } from "../../utils/api"

export const useGetOffersByGym = (gymId: string) => {
  return api.offer.getByGym.useQuery({gymId: gymId })
}
