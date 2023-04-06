import { api } from '../../utils/api'

export const useGetOffersByClass = (classId: string) => {
  return api.offer.getByClass.useQuery({ classId: classId })
}
