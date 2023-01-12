import { trpc } from "../utils/trpc"
import LoadingSpinner from "./LoadingSpinner"
import OfferCard from "./OfferCard"

const Offers = () => {
  const { isLoading, data: offers } = trpc.offers.getAll.useQuery()

  if (isLoading) return <LoadingSpinner />

  return (
    <div className='flex flex-wrap'>
      {offers?.map((offer) => {
        return <OfferCard key={offer.id} offerId={offer.id} today={new Date()} />
      })}
    </div>
  )
}

export default Offers
