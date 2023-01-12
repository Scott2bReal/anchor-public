import { Listbox, Transition } from "@headlessui/react"
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid"
import { useAtom } from "jotai"
import { ClassTypes } from "../types/ClassTypes"
import { classTypeAtom } from "../utils/atoms/classTypeAtom"
import { cssClassTypeCodes } from "../utils/cssClassTypeCodes"

export const ClassTypeSelector = () => {
  const [classType, setClassType] = useAtom(classTypeAtom)

  const classTypes: Array<ClassTypes> = [
    'Rock Warriors',
    'Stone Masters',
    'Teen Club',
    'Rock Hoppers',
    'Scramblers',
    'Spider Monkeys',
  ]

  return (
    <Listbox value={classType} onChange={setClassType} horizontal>
      <div className='mt-1 p-2 flex items-center h-max relative'>
        <Listbox.Button className={`${cssClassTypeCodes[classType]} p-2 mr-4 text-lg rounded-lg flex items-center gap-2 hover:scale-105 transition-colors duration-500 ease-in-out shadow-md shadow-neutral-900`}>
          <>
            {classType}
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
            {classTypes.map((classType) => (
              <Listbox.Option
                className={`${cssClassTypeCodes[classType]} box-border p-2 rounded-lg hover:cursor-pointer hover:scale-95 transition duration-150 ease-in-out shadow-md shadow-neutral-900`}
                key={classType}
                value={classType}
              >
                {classType}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
