import { useAtom } from 'jotai'
import { CampWaitlist } from '../../components/CampWaitlist'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useRedirectForCampPref } from '../../hooks/useRedirectForCampPref'
import { api } from '../../utils/api'
import { campYearAtom } from '../../utils/atoms/campYearAtom'
import { gymAtom } from '../../utils/atoms/gymAtom'

interface Props {
  initialFilter?: string
}

const CampWaitlistPage = ({ initialFilter }: Props) => {
  const [selectedGymId] = useAtom(gymAtom)
  const [year] = useAtom(campYearAtom)
  const { data: weeks, isLoading: weeksLoading } =
    api.campWeek.getByGymAndYear.useQuery({ gymId: selectedGymId, year: year })

  useRedirectForCampPref()
  if (weeksLoading) return <LoadingSpinner />
  if (!weeks) return <h1>Please select a gym</h1>

  return (
    <>
      <CampWaitlist weeks={weeks} initialFilter={initialFilter} />
    </>
  )
}

export default CampWaitlistPage
