import { FolderArrowDownIcon } from '@heroicons/react/24/outline'
import type {
  Climber,
  ClimbingClass,
  ClimbingSession,
  Gym,
  WaitlistEntry,
} from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useGetGymsForExport } from '../hooks/gym/useGetGymsForExport'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import formatClassTime from '../utils/formatClassTime'
import { toCamelCase } from '../utils/toCamelCase'
import LoadingSpinner from './LoadingSpinner'

interface CSVProps {
  gyms: (Gym & {
    classes: (ClimbingClass & {
      climbers: Climber[]
    })[]
    waitlistEntries: (WaitlistEntry & {
      climber: Climber
    })[]
  })[]
  climbingSession: ClimbingSession
}

interface SingleCSVProps {
  gym: Gym & {
    classes: (ClimbingClass & {
      climbers: Climber[]
    })[]
    waitlistEntries: (WaitlistEntry & {
      climber: Climber
    })[]
  }
  climbingSession: ClimbingSession
}

const generateScheduleCSV = ({ gym, climbingSession }: SingleCSVProps) => {
  if (gym.classes.length === 0) return ''
  const title = `${gym.name} ${climbingSession.name} ${climbingSession.year} Schedule Data`
  const headers = 'day,className,time,instructor,climbers'
  const body = gym.classes
    .map((climbingClass) => {
      const { day, className, instructor, climbers } = climbingClass
      const time = formatClassTime(
        climbingClass.startTime,
        climbingClass.endTime
      )
      return `"${day}","${className}","${time}","${instructor}","${climbers
        .map((climber) => `${climber.name}:${climber.parentEmail}`)
        .join(`\n`)}"`
    })
    .join(`\n`)

  return `${title}\n\n${headers}\n${body}\n`
}

const generateWaitlistCSV = ({ gym, climbingSession }: SingleCSVProps) => {
  if (gym.waitlistEntries.length === 0) return ''
  const title = `${gym.name} ${climbingSession.name} ${climbingSession.year} Waitlist Data`
  const headers = `climberName,climberEmail,dateAdded,classType,notes,priority`
  const body = gym.waitlistEntries
    .map((entry) => {
      const { createdAt, classType, notes, priority } = entry
      const climberName = entry.climber.name
      const climberEmail = entry.climber.parentEmail
      return `"${climberName}","${climberEmail}","${createdAt.toDateString()}","${classType}","${
        notes ?? ''
      }","${priority ? 'true' : 'false'}"`
    })
    .join(`\n`)

  return `${title}\n\n${headers}\n${body}\n`
}

const generateCSV = ({ gyms, climbingSession }: CSVProps) => {
  const csvGymArray = gyms.map((gym) => {
    const schedule = generateScheduleCSV({
      gym: gym,
      climbingSession: climbingSession,
    })
    const waitlist = generateWaitlistCSV({
      gym: gym,
      climbingSession: climbingSession,
    })
    return `${schedule}\n${waitlist}\n`
  })

  return `${csvGymArray.join('\n')}`
}

const downloadCSV = (csvString: string, climbingSession: ClimbingSession) => {
  const fileType = 'csv'
  const fileName = `${toCamelCase(climbingSession.name)}${climbingSession.year}`
  const blob = new Blob([csvString], {
    type: 'text/' + fileType + ';charset=utf8;',
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('visibility', 'hidden')
  link.download = `${fileName}.${fileType}`
  document.body.appendChild(link)
  toast.loading(`Exporting session data...`)
  setTimeout(() => {
    toast.dismiss()
    toast.success(`Successfully exported data`)
    link.click()
  }, 1000)
  document.body.removeChild(link)
}

export const ExportSession = () => {
  const [climbingSession] = useAtom(sessionAtom)
  const [isClicked, setIsClicked] = useState(false)
  const { data: gyms, isLoading: gymsLoading } = useGetGymsForExport(
    climbingSession?.id ?? ''
  )

  if (gymsLoading) {
    return (
      <button
        className={`rounded-lg bg-gray-800 p-2 opacity-50 shadow-md shadow-neutral-900`}
        disabled
      >
        <LoadingSpinner />
      </button>
    )
  }

  if (!gyms || !climbingSession) {
    return (
      <button
        className={`rounded-lg bg-gray-800 p-2 opacity-50 shadow-md shadow-neutral-900`}
        disabled
      >
        No Gyms
      </button>
    )
  }

  return (
    <button
      className={`${
        isClicked ? 'scale-95' : ''
      } rounded-lg bg-gray-800 p-4 shadow-md shadow-neutral-900 transition duration-300 ease-in-out hover:bg-emerald-800`}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      onClick={(e) => {
        e.preventDefault()
        const csvString = generateCSV({ gyms, climbingSession })
        downloadCSV(csvString, climbingSession)
      }}
    >
      <FolderArrowDownIcon className='inline h-6 w-6' />
    </button>
  )
}
