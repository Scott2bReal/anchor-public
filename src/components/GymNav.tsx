import { useAtom } from "jotai";
import { gymAtom } from "../utils/atoms/gymAtom";
import { trpc } from "../utils/trpc";

// Tab bar for gyms, used for schedule and waitlist pages
const GymNav = () => {
  const [selectedGym, setSelectedGym] = useAtom(gymAtom)

  const { data: gyms, isLoading } = trpc.gyms.getForGymNav.useQuery()

  if (isLoading) return <div>Fetching gyms...</div>
  if (!gyms) return <div>Could not find any gyms</div>

  const currentGym = gyms.find((gym) => gym.id === selectedGym)

  if (!currentGym) {
    return <></>
  }

  return (
    <nav className="flex justify-center">
      <ul className="flex gap-4 justify-center p-4">
        {gyms.map((gym) => {
          const isSelected = selectedGym === gym.id ? `${gym.cssCode} transition-colors duration-500 ease-in-out` : 'hover:bg-gray-600 transition ease-in-out duration-150'

          return (
            <li key={gym.id}>
              <button
                onClick={() => setSelectedGym(gym.id)}
                className={`p-4 text-lg font-extrabold rounded-lg hover:cursor-pointer ${isSelected}`}
              >{gym.name}</button></li>
          )
        })}
      </ul>
    </nav>
  )
}

export default GymNav
