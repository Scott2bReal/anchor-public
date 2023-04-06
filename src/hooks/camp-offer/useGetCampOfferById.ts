import { api } from "../../utils/api"

export const useGetCampOfferById = (campOfferId: string) => {
  return api.campOffer.getById.useQuery({ campOfferId: campOfferId })
}
