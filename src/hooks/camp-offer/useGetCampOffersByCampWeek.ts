import { api } from "../../utils/api"

export const useGetCampOffersByCampWeek = (weekId: string) => {
  return api.campOffer.getByWeek.useQuery({ weekId: weekId })
}
