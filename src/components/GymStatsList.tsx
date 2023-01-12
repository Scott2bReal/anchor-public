import { cssClassTypeCodes } from "../utils/cssClassTypeCodes";

interface GymStatsListProps {
  stats: Record<string, number> | undefined;
  gymName: string,
  cssCode?: string,
}

const GymStatsList = ({ gymName, cssCode, stats }: GymStatsListProps) => {
  if (!stats) return <div>Couldn&apos;t find stats for that gym</div>

  const totalEnrolled = Object.keys(stats).reduce((acc, className) => {
    const num = stats[className] as number
    return acc + num
  }, 0)

  return gymName === 'allGyms' ? (
    <>
      <h2 className={`font-bold text-xl`}>All Gyms</h2>
      <ul>
          <li className='font-bold'>Total Enrolled: {totalEnrolled}</li>
        {
          Object.keys(stats).map((className) => {
            return (
              <li key={gymName + className}>
                <span className={`${cssClassTypeCodes[className]}-text`}>{className}: </span>
                {stats[className]}
              </li>
            )
          })
        }

      </ul>
    </>
  ) : (
    <>
      <h2 className={`font-bold text-xl ${cssCode}-text`}>{gymName}</h2>
      <ul>
          <li className='font-bold'>Total Enrolled: {totalEnrolled}</li>
        {
          Object.keys(stats).map((className) => {
            return (
              <li key={gymName + className}>
                <span className={`${cssClassTypeCodes[className]}-text`}>{className}: </span>
                {stats[className]}
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

export default GymStatsList
