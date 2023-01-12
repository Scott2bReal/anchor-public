import { Dialog, Switch } from "@headlessui/react"
import { Climber, Gym, Offer, WaitlistEntry } from "@prisma/client"
import { useAtom } from "jotai"
import { Dispatch, SetStateAction, useState } from "react"
import { ClassTypeSelector } from "../components/ClassTypeSelector"
import EmailsButton from "../components/EmailsButton"
import LoadingSpinner from "../components/LoadingSpinner"
import RemoveFromWaitlistButton from "../components/RemoveFromWaitlistButton"
import Search from "../components/Search"
import WaitlistButton from "../components/WaitlistButton"
import WaitlistDetails from "../components/WaitlistDetails"
import WaitlistExportToCSV from "../components/WaitlistExportToCSV"
import WaitlistOfferButton from "../components/WaitlistOfferButton"
import WaitlistStats from "../components/WaitlistStats"
import WaitlistStatsButton from "../components/WaitlistStatsButton"
import useFindClimber from "../hooks/useFindClimber"
import { classTypeAtom } from "../utils/atoms/classTypeAtom"
import { climberAtom } from "../utils/atoms/climberAtom"
import { gymAtom } from "../utils/atoms/gymAtom"
import { cssClassTypeCodes } from "../utils/cssClassTypeCodes"
import grabClimber from "../utils/grabClimber"
import { hasKey } from "../utils/hasKey"
import { trpc } from "../utils/trpc"

const WaitlistPage = () => {
  const [selectedGym] = useAtom(gymAtom)
  const [selectedClimberId, setSelectedClimberId] = useAtom(climberAtom)
  const { data: climber } = useFindClimber(selectedClimberId)
  const { data: gym, isLoading: gymLoading } = trpc.gyms.getBasicInfo.useQuery({ gymId: selectedGym })
  const { isLoading, data: waitlistEntries } = trpc.waitlist.getEntriesForGym.useQuery({ gymId: selectedGym })

  const [classType,] = useAtom(classTypeAtom)

  const [monday, setMonday] = useState(true)
  const [tuesday, setTuesday] = useState(true)
  const [wednesday, setWednesday] = useState(true)
  const [thursday, setThursday] = useState(true)
  const [friday, setFriday] = useState(true)
  const [saturday, setSaturday] = useState(true)
  const [sunday, setSunday] = useState(true)
  const [noAvails, setNoAvails] = useState(true)

  const [statsOpen, setStatsOpen] = useState(false)
  const toggleStatsOpen = () => setStatsOpen(!statsOpen)

  const selectedAvails: { [key: string]: boolean } = { mon: monday, tues: tuesday, weds: wednesday, thurs: thursday, fri: friday, sat: saturday, sun: sunday, }
  const allSelected = Object.keys(selectedAvails).every((day) => { return selectedAvails[day] })

  const days: { [idx: string]: { state: boolean, setter: Dispatch<SetStateAction<boolean>> } } = {
    Monday: { state: monday, setter: setMonday },
    Tuesday: { state: tuesday, setter: setTuesday },
    Wednesday: { state: wednesday, setter: setWednesday },
    Thursday: { state: thursday, setter: setThursday },
    Friday: { state: friday, setter: setFriday },
    Saturday: { state: saturday, setter: setSaturday },
    Sunday: { state: sunday, setter: setSunday },
  }

  function hasNoAvailsSet(entry: WaitlistEntry) {
    const avails = [
      entry.mon,
      entry.tues,
      entry.weds,
      entry.thurs,
      entry.fri,
      entry.sat,
      entry.sun,
    ]

    if (!avails.some((avail) => avail)) return true
    return false
  }

  if (isLoading || gymLoading) return <div className="flex justify-center h-96 overflow-scroll"><LoadingSpinner /></div>
  if (!gym) return <div>Couldn&apos;t find that gym</div>
  if (!waitlistEntries) return <div>No waitlist entries found</div>

  const entriesByClass: Array<WaitlistEntry & { climber: Climber & { offers: Offer[] }, gym: Gym, }> = waitlistEntries.filter((entry) => {
    return entry.classType === classType
  })

  const filteredEntries: Array<WaitlistEntry & { climber: Climber & { offers: Offer[] }, gym: Gym }> = entriesByClass.filter((entry) => {
    if (allSelected && noAvails) return true

    const result = Object.keys(selectedAvails).some((day) => {
      if (hasKey(entry, day)) {
        return entry[day] && selectedAvails[day]
      }
    })

    if (hasNoAvailsSet(entry)) {
      return noAvails
    }

    return result
  })

  const climbers = filteredEntries.map((entry: WaitlistEntry & { climber: Climber & { offers: Offer[] } }) => {
    return entry.climber
  })

  const toggleNoAvails = () => {
    setNoAvails(!noAvails);
  }

  const toggleAll = () => {
    if (!allSelected) {
      setMonday(true)
      setTuesday(true)
      setWednesday(true)
      setThursday(true)
      setFriday(true)
      setSaturday(true)
      setSunday(true)
    } else {
      setMonday(false)
      setTuesday(false)
      setWednesday(false)
      setThursday(false)
      setFriday(false)
      setSaturday(false)
      setSunday(false)
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4 p-2 justify-start items-center'>
        <h1 className='text-xl font-bold'>Filter by Class Type</h1>
        <ClassTypeSelector />
        <div className='flex gap-2 items-center relative'>
          <EmailsButton climbers={climbers} helpText={true} />
          <WaitlistStatsButton toggleStatsOpen={() => toggleStatsOpen()} />
        </div>
        <WaitlistExportToCSV gym={gym} waitlistEntries={waitlistEntries} />

        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='flex gap-2 items-center justify-center'>
            <h2 className='text-lg font-bold'>Filter by Availability</h2>
          </div>
          <p>Selecting &#34;None&#34; will display entries with no availability</p>
          <div className='flex gap-2 items-center justify-center'>
            <Switch
              checked={allSelected}
              onChange={toggleAll}
              className={`${cssClassTypeCodes[classType]} hover:scale-95 duration-500 hover:duration-150 transition ease-in-out p-4 ui-not-checked:bg-gray-800 rounded-lg`}
            >
              All
            </Switch>
            {
              Object.keys(days).map((day) => {
                return <Switch
                  key={day}
                  checked={days[day]?.state}
                  onChange={days[day]?.setter}
                  className={`${cssClassTypeCodes[classType]} hover:scale-95 transition duration-500 hover:duration-150 ease-in-out p-2 ui-not-checked:bg-gray-800 rounded-lg`}
                >
                  {day}
                </Switch>
              })
            }
            <Switch
              checked={noAvails}
              onChange={toggleNoAvails}
              className={`${cssClassTypeCodes[classType]} hover:scale-95 duration-500 hover:duration-150 transition ease-in-out p-4 ui-not-checked:bg-gray-800 rounded-lg`}
            >
              None
            </Switch>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center gap-2'>
          <h2 className='text-lg'>Add {climber ? climber.name : 'a climber'} to the <span className={`${cssClassTypeCodes[classType]}-text font-bold`}>{classType}</span> waitlist</h2>
          {
            selectedClimberId
              ?
              <WaitlistButton gymId={selectedGym} climberId={selectedClimberId} classType={classType} />
              :
              <Search />
          }
        </div>

        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-8 text-center">Position</th>
              <th className="px-8 text-center">Climber</th>
              <th className="px-8 text-center">Added</th>
              <th className="px-8 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="mx-4">
            {filteredEntries.map((entry, idx) => {
              return (
                <tr key={entry.id}>
                  <td className='px-8 text-center'>{idx + 1}</td>
                  <td className='px-8 text-start'>
                    <div className='flex gap-2 items-center justify-start'>
                      <RemoveFromWaitlistButton entry={entry} />
                      <span
                        onClick={() => grabClimber(entry.climber, () => setSelectedClimberId(entry.climber.id))}
                        className='hover:cursor-pointer'
                      >
                        {entry.climber.name}
                      </span>
                      <WaitlistOfferButton climber={entry.climber} />
                    </div>
                  </td>
                  <td className='px-8 text-center'>{entry.createdAt.toLocaleDateString()}</td>
                  <td className='px-8 text-center'><WaitlistDetails entry={entry} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Dialog
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'
          >
            <WaitlistStats />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>

  )
}

export default WaitlistPage
