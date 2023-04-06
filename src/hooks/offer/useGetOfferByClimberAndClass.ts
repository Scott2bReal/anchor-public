import { api } from "../../utils/api"

interface Props {
  climberId: string
  classId: string
}

export const useGetOfferByClimberAndClass = ({ climberId, classId }: Props) => {
  return api.offer.getByClimberAndClass.useQuery({
    climberId: climberId,
    classId: classId
  })
}
