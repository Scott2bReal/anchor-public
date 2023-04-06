import { api } from "../../utils/api"

interface Props {
  weekId: string
  climberId: string
}
export const useGetCampOfferByClimberAndWeek = ({weekId, climberId}: Props) => {
  return api.campOffer.getByClimberAndWeek.useQuery({ weekId: weekId, climberId: climberId })
}
