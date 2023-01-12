import { useAtom } from "jotai"
import LoadingSpinner from "../components/LoadingSpinner"
import OfferCard from "../components/OfferCard"
import { gymAtom } from "../utils/atoms/gymAtom"
import { trpc } from "../utils/trpc"

const OffersPage = () => {
  const [selectedGymId] = useAtom(gymAtom)
  const { isLoading, data: offers } = trpc.offers.getByGym.useQuery({gymId: selectedGymId })
  const today = new Date

  if (isLoading) return <LoadingSpinner />
  if (!offers) return <div>Could not find that gym. Please email scott@faclimbing.com</div>

  return (
    <div className='text-center p-4'>
      <h1 className="font-bold text-2xl text-gray-400 p-2">Offers</h1>

      <div className='flex flex-wrap gap-4'>
        {offers.map((offer) => {
          return <OfferCard key={offer.id} offerId={offer.id} today={today} />
        })}
      </div>
    </div>
  )
}

export default OffersPage
