import { useAtom } from 'jotai'
import LoadingSpinner from '../components/LoadingSpinner'
import OfferCard from '../components/OfferCard'
import { useGetOffersByGym } from '../hooks/offer/useGetOffersByGym'
import { useRedirectForCampPref } from '../hooks/useRedirectForCampPref'
import { gymAtom } from '../utils/atoms/gymAtom'

const OffersPage = () => {
  const [selectedGymId] = useAtom(gymAtom)
  const { isLoading, data: offers } = useGetOffersByGym(selectedGymId)
  const today = new Date()

  useRedirectForCampPref()
  if (isLoading) return <LoadingSpinner />
  if (!offers)
    return <div>Could not find that gym. Please email scott@faclimbing.com</div>

  return (
    <div className='p-4 text-center'>
      <h1 className='p-2 text-2xl font-bold text-gray-400'>Offers</h1>

      <div className='flex flex-wrap gap-4'>
        {offers.map((offer) => {
          return <OfferCard key={offer.id} offerId={offer.id} today={today} />
        })}
      </div>
    </div>
  )
}

export default OffersPage
