import type { ClimbingSession } from '@prisma/client'
import type { ClassTypes } from '../types/ClassTypes'
import { api } from '../utils/api'
import { cssClassTypeCodes } from '../utils/cssClassTypeCodes'
import { generateEnrollmentStats } from '../utils/generateEnrollmentStats'
import { hasKey } from '../utils/hasKey'
import ClassEnrollmentStatsRow from './ClassEnrollmentStatsRow'
import LoadingSpinner from './LoadingSpinner'

interface ClassStatsProps {
  climbingSession: ClimbingSession
}

const EnrollmentStats = ({ climbingSession }: ClassStatsProps) => {
  const { data: allClasses, isLoading: classesLoading } =
    api.climbingSession.getAllClasses.useQuery({ id: climbingSession.id })
  const { data: gyms, isLoading: gymsLoading } = api.gym.getForGymNav.useQuery()

  if (classesLoading || gymsLoading) return <LoadingSpinner />
  if (!allClasses || !gyms)
    return <div>Couldn&apos;t find any classes for this session</div>

  const rosterSizes = generateEnrollmentStats(allClasses, gyms)

  const allGymStats = rosterSizes.allGyms as Record<string, number>

  const classNames: ClassTypes[] = [
    'Stone Masters',
    'Rock Warriors',
    'Rock Hoppers',
    'Scramblers',
    'Teen Club',
    'Spider Monkeys',
  ]

  return (
    <div className='max-h-[95vh] overflow-scroll p-4 text-center'>
      <h1 className='text-2xl font-extrabold'>
        Enrollment Stats for {climbingSession.name} {climbingSession.year}
      </h1>
      <table>
        <thead className='py-2'>
          <th></th>
          {classNames.sort().map((className) => {
            return (
              <th
                key={className}
                className={`font-bold ${
                  cssClassTypeCodes[className] ?? ''
                }-text p-2 text-xl`}
              >
                {className}
              </th>
            )
          })}
          <th className='text-xl font-bold'>All Classes</th>
        </thead>
        <tbody>
          {gyms.map((gym) => {
            if (!hasKey(rosterSizes, gym.name) && !rosterSizes[gym.name]) {
              return <tr key={gym.id}>Could not find info for that gym</tr>
            } else {
              const gymStats = rosterSizes[gym.name] as Record<string, number>
              return (
                <ClassEnrollmentStatsRow
                  key={gym.id}
                  stats={gymStats}
                  cssCode={gym.cssCode}
                  gymName={gym.name}
                />
              )
            }
          })}
          <ClassEnrollmentStatsRow
            key={'allGyms'}
            stats={allGymStats}
            gymName='allGyms'
          />
        </tbody>
      </table>
    </div>
  )
}

export default EnrollmentStats
