import { Dialog, Listbox } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { api } from '../utils/api'
import { campYearAtom } from '../utils/atoms/campYearAtom'
import { CampNewYearForm } from './CampNewYearForm'
import { CloseThisWindowButton } from './ClassInfo'
import LoadingSpinner from './LoadingSpinner'

export const CampYearSelector = () => {
  const [selectedYear, setSelectedYear] = useAtom(campYearAtom)
  const [createNewOpen, setCreateNewOpen] = useState(false)
  const { data: campYears, isLoading: campYearsLoading } =
    api.campWeek.getYears.useQuery()

  if (campYearsLoading) return <LoadingSpinner />
  if (!campYears) return <div>Couldn&apos;t find any camp info</div>

  return (
    <>
      <Listbox by='id' value={selectedYear} onChange={setSelectedYear}>
        <Listbox.Button className='text-xl font-extrabold'>
          <div className='flex items-center justify-center gap-2'>
            {`🏕️ Camp ${selectedYear}`}
            <ChevronUpDownIcon className='h-6 w-6' />
          </div>
        </Listbox.Button>

        <Listbox.Options className='absolute top-[32px] z-[8] flex w-full flex-col items-center justify-center rounded-lg bg-slate-700'>
          {campYears
            .map((year) => year.year)
            .map((year) => {
              return (
                <Listbox.Option
                  key={year}
                  value={year}
                  className='flex w-full items-center justify-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500'
                >
                  {year}
                  <CheckIcon
                    className={`${
                      selectedYear === year ? 'block' : 'hidden'
                    } h-4 w-4`}
                  />
                </Listbox.Option>
              )
            })}
          <button
            className='flex w-full items-center justify-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500'
            onClick={() => setCreateNewOpen(true)}
          >
            <span>Add New Year</span>
            <PlusCircleIcon className='h-6 w-6' />
          </button>
        </Listbox.Options>
      </Listbox>
      <Dialog open={createNewOpen} onClose={() => setCreateNewOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex flex-col items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6 drop-shadow-lg'>
            <CampNewYearForm
              selectedYear={selectedYear}
              onRequestClose={() => setCreateNewOpen(false)}
            />
            <CloseThisWindowButton
              closeFunction={() => setCreateNewOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
