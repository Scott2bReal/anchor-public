import { api } from "../../utils/api"

interface Props {
  selectedClimberId: string | null
}

export const useGetClimberById = ({ selectedClimberId }: Props) => {
  return api.climber.getById.useQuery({
    id: selectedClimberId ?? '',
  })
}
