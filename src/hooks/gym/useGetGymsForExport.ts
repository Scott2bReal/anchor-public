import { trpc } from "../../utils/trpc"

export const useGetGymsForExport = (sessionId: string) => {
  return trpc.gyms.getForExport.useQuery({sessionId: sessionId})
}
