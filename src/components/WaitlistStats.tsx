import { WaitlistEntry } from "@prisma/client"
import { ClassTypes } from "../types/ClassTypes"
import { cssClassTypeCodes } from "../utils/cssClassTypeCodes"
import { trpc } from "../utils/trpc"
import LoadingSpinner from "./LoadingSpinner"

const WaitlistStats = () => {
  const { data: allUniqueEntries, isLoading } = trpc.waitlist.getAllUniqueClimberEntries.useQuery()
  const { data: gyms, isLoading: gymsLoading } = trpc.gyms.getForGymNav.useQuery()
  const { data: allEntries, isLoading: allEntriesLoading } = trpc.waitlist.getAll.useQuery()

  if (isLoading || gymsLoading || allEntriesLoading) return <LoadingSpinner />
  if (!allEntries || !allUniqueEntries) return <div>Couldn&apos;t find any waitlist data!</div>
  if (!gyms) return <div>Could&apos;t find any gyms!</div>

  const classNames: ClassTypes[] = [
    'Rock Warriors',
    'Stone Masters',
    'Teen Club',
    'Scramblers',
    'Rock Hoppers',
    'Spider Monkeys',
  ]

  const classTypeTotal = (entries: WaitlistEntry[], classType: ClassTypes) => {
    return entries.filter((entry) => {
      return entry.classType === classType
    }).length
  }

  interface GymListProps {
    gym: { id: string, name: string, cssCode: string };
    entries: WaitlistEntry[];
  }

  const GymList = ({ gym, entries }: GymListProps) => {
    const gymEntries =
      entries.filter((entry) => {
        return entry.gymId === gym.id
      })


    return (
      <>
        <li><span className={`text-xl font-bold ${gym.cssCode}-text`}>{gym.name}</span></li>
        <li><span className='text-lg font-bold'>Total: </span>{gymEntries.length}</li>
        {
          classNames.map((name) => {
            return (
              <li key={name + gym.id}><span className={`font-bold ${cssClassTypeCodes[name]}-text`}>{name}</span>: {classTypeTotal(gymEntries, name)}</li>
            )
          })
        }
      </>
    )
  }

  return (
    <div className='text-center max-h-[95vh] overflow-scroll p-4'>
      <h1 className='font-extrabold text-2xl'>Waitlist Stats</h1>
      <h3>Total Climbers on all Waitlists: {allUniqueEntries.length}</h3>
      <br />
      <h2 className='font-bold text-xl'>All Gyms</h2>
      <ul className='text-start'>
        <li><span className='font-bold'>Total:</span> {allEntries.length}</li>
        {
          classNames.map((name) => {
            return (
              <li key={name}><span className={`font-bold ${cssClassTypeCodes[name]}-text`}>{name}</span>: {classTypeTotal(allEntries, name)}</li>
            )
          })
        }
        <br />
        {
          gyms.map((gym) => {
            return (
              <>
                <GymList key={gym.id} gym={gym} entries={allEntries} />
                <br />
              </>
            )
          })
        }
      </ul>
    </div>
  )
}

export default WaitlistStats
