import { api } from "../../utils/api"

export const useGetCampYear = (selectedYear: number) => {
  return api.campWeek.getYear.useQuery({year: selectedYear})
}
