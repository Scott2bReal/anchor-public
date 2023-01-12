import { Listbox, Transition } from "@headlessui/react"
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid"
import { useAtom } from "jotai"
import { gymAtom } from "../utils/atoms/gymAtom"

type GymSelectorProps = {
  gyms: {id: string, name: string, cssCode: string}[];
  selectedGym: {name: string, cssCode: string};
}

export const GymSelector = ({gyms, selectedGym}: GymSelectorProps) => {
  const [selectedGymId, setSelectedGymId] = useAtom(gymAtom)

  if (!gyms || !selectedGym) return <div>No gyms found!</div>

  return (
    <Listbox value={selectedGymId} onChange={setSelectedGymId} horizontal>
      <div className='mt-1 p-2 flex items-center h-max relative'>
        <Listbox.Button className={`shadow-md shadow-neutral-900 ${selectedGym.cssCode} p-2 mr-4 text-lg rounded-lg flex items-center gap-2 hover:scale-105 transition-colors duration-500 ease-in-out`}>
          <>
            {selectedGym.name}
            <ChevronDoubleRightIcon className='h-4 w-4' />
            </>
        </Listbox.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options className='flex gap-1'>
            {gyms.map((gym) => (
              <Listbox.Option
                className={`${gym.cssCode} box-border p-2 rounded-lg hover:cursor-pointer hover:scale-95 transition duration-150 ease-in-out shadow-md shadow-neutral-900`}
                key={gym.id}
                value={gym.id}
              >
                {gym.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
