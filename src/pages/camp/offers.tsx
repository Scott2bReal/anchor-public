import { useAtom } from 'jotai'
import { CampOfferCard } from '../../components/CampOfferCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useGetCampOffersByGym } from '../../hooks/camp-offer/useGetCampOffersByGym'
import { useRedirectForCampPref } from '../../hooks/useRedirectForCampPref'
import { gymAtom } from '../../utils/atoms/gymAtom'

const CampOffersPage = () => {
  const [selectedGymId] = useAtom(gymAtom)
  const { isLoading, data: campOffers } = useGetCampOffersByGym(selectedGymId)
  const today = new Date()

  useRedirectForCampPref()
  if (isLoading) return <LoadingSpinner />
  if (!campOffers)
    return <div>Could not find that gym. Please email scott@faclimbing.com</div>

  return (
    <div className='p-4 text-center'>
      <h1 className='p-2 text-2xl font-bold text-gray-400'>Offers</h1>

      <div className='flex flex-wrap gap-4'>
        {campOffers.map((campOffer) => {
          return (
            <CampOfferCard
              key={campOffer.id}
              offerId={campOffer.id}
              today={today}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CampOffersPage
