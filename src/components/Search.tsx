import { Combobox } from '@headlessui/react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import type { Climber } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useGetAllClimbers } from '../hooks/climber/useGetAllClimbers'
import { climberAtom } from '../utils/atoms/climberAtom'
import capitalize from '../utils/capitalize'
import NewClimberForm from './NewClimberForm'

const Search = () => {
  const { isLoading, data: climbers } = useGetAllClimbers()

  const showLoadingScreen = isLoading || !climbers
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [selectedClimber, setSelectedClimber] = useState<Climber | null>(null)
  const [query, setQuery] = useState<string | null>(null)
  const [, setSearchOpen] = useState(false)

  const [showNewClimberForm, setShowNewClimberForm] = useState(false)

  if (showLoadingScreen)
    return (
      <div className='basis-1'>
        <input className='w-52 shadow-md shadow-neutral-900' />
        Fetching climber info...
      </div>
    )

  const filteredClimbers: Climber[] =
    query === '' || query === null
      ? climbers
      : climbers.filter((climber) => {
          return (
            climber &&
            query &&
            climber.name.toLowerCase().includes(query.toLowerCase())
          )
        })

  return showNewClimberForm ? (
    <NewClimberForm
      query={query ?? ''}
      onRequestClose={() => setShowNewClimberForm(false)}
      setQuery={setQuery}
    />
  ) : (
    <>
      <div className='relative p-4'>
        <Combobox
          nullable
          value={selectedClimber}
          onChange={(climber) => {
            setShowNewClimberForm(false)
            if (!climber) return null
            setSelectedClimberId(climber.id)
            setSelectedClimber(climber)
            setSearchOpen(true)
          }}
        >
          {({ open }) => (
            <>
              <Combobox.Label className='mr-2 font-bold text-teal-500'>
                Search
              </Combobox.Label>
              <Combobox.Input
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(climber: Climber) => climber?.name ?? ''}
                className='w-52 rounded-lg bg-gray-100 px-1 text-slate-900 shadow-md shadow-neutral-900'
              />
              {open && (
                <Combobox.Options
                  static
                  className='absolute z-40 m-2 h-36 overflow-scroll rounded-lg bg-neutral-800 px-1 shadow-md shadow-black'
                >
                  {filteredClimbers.map((climber) => (
                    <Combobox.Option
                      className='rounded-lg px-1 text-gray-100 hover:cursor-pointer ui-active:bg-slate-500'
                      key={climber.id}
                      value={climber}
                      onClick={() => {
                        setShowNewClimberForm(false)
                        setSelectedClimberId(climber.id)
                      }}
                    >
                      {climber.name}
                    </Combobox.Option>
                  ))}

                  {/* Add new climber button */}
                  <button
                    className='my-2 flex w-full items-center gap-2 rounded-lg p-1 hover:cursor-pointer hover:bg-slate-500 ui-active:bg-slate-500'
                    onClick={() => {
                      setShowNewClimberForm(true)
                      setSelectedClimber(null)
                      setSelectedClimberId(null)
                    }}
                  >
                    <>
                      Add {capitalize(query)}
                      <PlusCircleIcon className='h-6 w-6' />
                    </>
                  </button>
                </Combobox.Options>
              )}
            </>
          )}
        </Combobox>
      </div>
    </>
  )
}

export default Search
