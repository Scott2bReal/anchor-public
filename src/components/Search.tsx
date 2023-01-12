import { Combobox } from '@headlessui/react'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Climber } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { climberAtom } from '../utils/atoms/climberAtom'
import { trpc } from '../utils/trpc'
import NewClimberForm from './NewClimberForm'

const Search = () => {
  const { isLoading, data: climbers } = trpc.climber.getAll.useQuery()

  const showLoadingScreen = isLoading || !climbers
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [selectedClimber, setSelectedClimber] = useState<Climber | null>(null)
  const [query, setQuery] = useState<string | null>(null)
  const [, setSearchOpen] = useState(false)

  const [showNewClimberForm, setShowNewClimberForm] = useState(false)

  if (showLoadingScreen) return <div className='basis-1'>
    <input className='w-52 shadow-md shadow-neutral-900' />
    Fetching climber info...
  </div>

  const filteredClimbers: Climber[] =
    query === '' || query === null
      ? climbers
      : (climbers.filter((climber) => {
        return climber && query && climber.name.toLowerCase().includes(query.toLowerCase())
      }))

  return showNewClimberForm
    ?
    <NewClimberForm query={query ?? ''} onRequestClose={() => setShowNewClimberForm(false)} setQuery={setQuery} />
    :
    (
      <>
        <div className="p-4 relative">
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
                <Combobox.Label className='font-bold text-teal-500 mr-2'>Search</Combobox.Label>
                <Combobox.Input
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(climber: Climber) => climber?.name ?? ''}
                  className='bg-gray-100 text-slate-900 w-52 shadow-md shadow-neutral-900 rounded-lg px-1'
                  />
                {open && (
                  <Combobox.Options
                    static
                    className='bg-neutral-800 shadow-md shadow-black m-2 px-1 absolute rounded-lg h-36 overflow-scroll'
                  >
                    {filteredClimbers.map((climber) => (
                      <Combobox.Option
                        className='ui-active:bg-slate-500 text-gray-100 hover:cursor-pointer rounded-lg px-1'
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
                      className='ui-active:bg-slate-500 flex items-center gap-2 my-2 hover:bg-slate-500 p-1 w-full hover:cursor-pointer rounded-lg'
                      onClick={() => {
                        setShowNewClimberForm(true)
                        setSelectedClimber(null)
                        setSelectedClimberId(null)
                      }}
                    >
                      <>
                        Add New Climber
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
