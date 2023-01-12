import { ClassTypes } from "../types/ClassTypes";
import { hasKey } from "../utils/hasKey";

interface ClassEnrollmentStatsRowProps {
  stats: Record<string, number>;
  gymName: string;
  cssCode?: string;
}

const classNames: ClassTypes[] = [
  'Stone Masters',
  'Rock Warriors',
  'Rock Hoppers',
  'Scramblers',
  'Teen Club',
  'Spider Monkeys',
]


const ClassEnrollmentStatsRow = ({ stats, gymName, cssCode }: ClassEnrollmentStatsRowProps) => {
  const totalEnrolled = Object.keys(stats).reduce((acc, className) => {
      const num = stats[className] as number
      return acc + num
    }, 0)

  return gymName === 'allGyms' ? (
    <tr className={`border-[1px] font-bold text-xl`}>
      <th className={`font-bold`}>All Gyms</th>
      {
        classNames.sort().map(className => {
          return !hasKey(stats, className) ? (
            <td key={className + gymName}>0</td>
          ) : (
            <td key={className + gymName}>{stats[className]}</td>
          )
        })
      }
      <td>{totalEnrolled}</td>
    </tr>
  ) : (
    <tr className={`border-[1px] ${cssCode} text-xl `}>
      <th className={`font-bold`}>{gymName}</th>
      {
        classNames.sort().map(className => {
          return !hasKey(stats, className) ? (
            <td key={className + gymName}>0</td>
          ) : (
            <td key={className + gymName}>{stats[className]}</td>
          )
        })
      }
        <td className={'font-bold'}>{
          Object.keys(stats).reduce((acc, className) => {
            const num = stats[className] as number
            return acc + num
          }, 0)
        }</td>
    </tr>
  )
}

export default ClassEnrollmentStatsRow
