import { api } from "../../utils/api"

export const useGetOfferById = (offerId: string) => {
  return api.offer.getById.useQuery({ offerId: offerId })
}
