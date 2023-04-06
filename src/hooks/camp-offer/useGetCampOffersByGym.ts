import { useAtom } from "jotai"
import { api } from "../../utils/api"
import { campYearAtom } from "../../utils/atoms/campYearAtom"

export const useGetCampOffersByGym = (gymId: string) => {
  const [year] = useAtom(campYearAtom)
  return api.campOffer.getAllByGymAndYear.useQuery({gymId: gymId, year: year })
}
