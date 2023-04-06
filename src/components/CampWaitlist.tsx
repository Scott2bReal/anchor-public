import { Switch } from '@headlessui/react'
import type { CampWeek } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import useFindClimber from '../hooks/useFindClimber'
import { api } from '../utils/api'
import { campYearAtom } from '../utils/atoms/campYearAtom'
import { climberAtom } from '../utils/atoms/climberAtom'
import { gymAtom } from '../utils/atoms/gymAtom'
import { formatCampWeekDates } from '../utils/formatCampWeekDates'
import grabClimber from '../utils/grabClimber'
import { CampRemoveFromWaitlistButton } from './CampRemoveFromWaitlistButton'
import { CampWaitlistButton } from './CampWaitlistButton'
import { CampWaitlistDetails } from './CampWaitlistDetails'
import { CampWaitlistOfferButton } from './CampWaitlistOfferButton'
import EmailsButton from './EmailsButton'
import LoadingSpinner from './LoadingSpinner'
import Search from './Search'

interface Props {
  weeks: CampWeek[]
  initialFilter?: string
}

export const CampWaitlist = ({ weeks, initialFilter }: Props) => {
  // Atomic data
  const [selectedGymId] = useAtom(gymAtom)
  const [selectedClimberId, setSelectedClimberId] = useAtom(climberAtom)
  const [year] = useAtom(campYearAtom)

  // API calls
  const { data: gym, isLoading: gymLoading } = api.gym.getBasicInfo.useQuery({
    gymId: selectedGymId,
  })
  const { data: entries, isLoading: entriesLoading } =
    api.campWaitlist.getByGymAndYear.useQuery({
      gymId: selectedGymId,
      year: year,
    })
  const { data: climber } = useFindClimber(selectedClimberId)

  // Filter management
  const avails = weeks.reduce((acc: { [key: string]: boolean }, week) => {
    const key = String(week.id)
    if (initialFilter) {
      acc[key] = initialFilter === key
    } else {
      acc[key] = true
    }
    return acc
  }, {})

  const [availStates, setAvailStates] = useState<{ [key: string]: boolean }>(
    avails
  )
  const [allSelected, setAllSelected] = useState(true)
  const [noAvails, setNoAvails] = useState(true)
  const toggleNoAvails = () => setNoAvails(!noAvails)

  const toggleAll = () => {
    const all =
      Object.keys(availStates).filter((key) => availStates[key]).length ===
      weeks.length
    const avails = weeks.reduce((acc: { [key: string]: boolean }, week) => {
      const key = String(week.id)
      acc[key] = !all
      return acc
    }, {})
    setAllSelected(!allSelected)
    setAvailStates(avails)
  }

  // Handler for when the user is setting waitlist availability
  const handleSetAvails = (key: string) => {
    const updatedAvails = { ...availStates }
    updatedAvails[key] = !updatedAvails[key]
    setAvailStates(updatedAvails)
  }

  if (gymLoading || entriesLoading) return <LoadingSpinner />
  if (!gym || !entries) return <h1>Please select a gym</h1>

  const filteredEntries = entries.filter((entry) => {
    if (entry.availability.length === 0) return noAvails
    for (let i = 0; i < entry.availability.length; i++) {
      const weekId = entry.availability[i]
      if (!weekId) return false
      if (availStates[weekId]) return true
    }
  })

  const climbers = filteredEntries.map((entry) => entry.climber)

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='p-2 text-3xl font-bold'>
          🏕️ <span className={`${gym.cssCode}-text`}>{gym.name}</span> {year}{' '}
          Camp Waitlist 🏕️
        </h1>
        <div className='w-fit'>
          <EmailsButton climbers={climbers} />
        </div>

        <h2 className='text-lg font-bold'>Filter by Availability</h2>
        <p>
          Selecting &#34;None&#34; will display entries with no availability
        </p>
        <div className='flex items-center justify-center gap-2'>
          <Switch
            checked={
              Object.keys(availStates).filter((key) => availStates[key])
                .length === weeks.length
            }
            onChange={toggleAll}
            className={`${gym.cssCode} rounded-lg p-4 transition duration-500 ease-in-out hover:scale-95 hover:duration-150 ui-not-checked:bg-gray-800`}
          >
            All
          </Switch>
          {weeks.map((week) => {
            const key = week.id
            return (
              <Switch
                key={key}
                checked={availStates[key]}
                onChange={() => handleSetAvails(key)}
                className={`${gym.cssCode} rounded-lg p-2 transition duration-500 ease-in-out hover:scale-95 hover:duration-150 ui-not-checked:bg-gray-800`}
              >
                <h3 className='font-bold'>Week {week.weekNumber}</h3>
                <p>{formatCampWeekDates(week)}</p>
              </Switch>
            )
          })}
          <Switch
            checked={noAvails}
            onChange={toggleNoAvails}
            className={`${gym.cssCode} rounded-lg p-4 transition duration-500 ease-in-out hover:scale-95 hover:duration-150 ui-not-checked:bg-gray-800`}
          >
            None
          </Switch>
        </div>

        {/* Add Climber Button */}
        <div className='p-2 text-center'>
          <h2 className='p-2 text-lg'>
            Add {climber ? climber.name : 'a climber'} to the camp waitlist
          </h2>
          {selectedClimberId ? (
            <CampWaitlistButton
              gym={gym}
              weeks={weeks}
              climberId={selectedClimberId}
              year={year}
            />
          ) : (
            <Search />
          )}
        </div>

        <table className='table-auto'>
          <thead>
            <tr>
              <th className='px-8 text-center'>Position</th>
              <th className='px-8 text-center'>Climber</th>
              <th className='px-8 text-center'>Added</th>
              <th className='px-8 text-center'>Details</th>
            </tr>
          </thead>
          <tbody className='mx-4'>
            {filteredEntries.map((entry, idx) => {
              return (
                <tr key={entry.id}>
                  <td className='px-8 text-center'>{idx + 1}</td>
                  <td className='px-8 text-start'>
                    <div className='flex items-center justify-start gap-2'>
                      <CampRemoveFromWaitlistButton
                        entry={entry}
                        gymName={gym.name}
                      />
                      <span
                        onClick={() =>
                          grabClimber(entry.climber, () =>
                            setSelectedClimberId(entry.climber.id)
                          )
                        }
                        className='hover:cursor-pointer'
                      >
                        {entry.climber.name}
                      </span>
                      <CampWaitlistOfferButton climber={entry.climber} />
                    </div>
                  </td>
                  <td className='px-8 text-center'>
                    {entry.createdAt.toLocaleDateString()}
                  </td>
                  <td className='px-8 text-center'>
                    <CampWaitlistDetails entry={entry} weeks={weeks} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
