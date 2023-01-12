import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { Climber, Gym, Offer, WaitlistEntry } from "@prisma/client";
import { ExportToCsv } from "export-to-csv";
import { useState } from "react";

interface WaitlistExportToCSVProps {
  gym: Gym;
  waitlistEntries: (WaitlistEntry & {
    gym: Gym,
    climber: Climber & {
      offers: Offer[],
    }
  })[]
}

interface CSVReadyObject {
  climberName?: string;
  dateAdded?: Date;
  classType?: string;
  climberEmail?: string;
  notes?: string | null;
  priority?: boolean;
}

const WaitlistExportToCSV = ({ gym, waitlistEntries }: WaitlistExportToCSVProps) => {
  const [hovered, setHovered] = useState(false)

  if (!gym || !waitlistEntries) return <div>Couldn&apos;t find data</div>

  const sortEntries = (a:CSVReadyObject, b: CSVReadyObject) => {
    if ((a && a.dateAdded) && (b && b.dateAdded)) {
      if (a.priority) return -1
      if (b.priority) return -1

      if (a.dateAdded > b.dateAdded) {
        return 1
      } else if (a.dateAdded < b.dateAdded) {
        return -1
      } else {
        return 0
      }
    }
    return 0
  }

  const formatEntriesForCSV = (entries: (WaitlistEntry & { climber: Climber })[]) => {
    return entries.map((entry) => {
      const object: CSVReadyObject = {}
      object.climberName = entry.climber.name
      object.dateAdded = entry.createdAt
      object.classType = entry.classType
      object.climberEmail = entry.climber.parentEmail
      object.notes = entry.notes
      object.priority = entry.priority
      return object
    }).sort(sortEntries)
  }

  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: `${gym.name} Waitlist Data`,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const csvExporter = new ExportToCsv(options)

  return (
    <div className='relative'>
      <span className={`${hovered ? '-translate-x-[50px] opacity-100' : 'opacity-0'} w-max absolute left-[-100px] top-[4px] text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}>Export Waitlist Data</span>
      <button
        onClick={() => csvExporter.generateCsv(formatEntriesForCSV(waitlistEntries))}
        className='py-2 px-4 border-[1px] rounded-lg border-white hover:scale-95 transition duration-150 ease-in-out z-[2]'
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FolderArrowDownIcon className='h-4 w-4' />
      </button>
      <span className={`${hovered ? 'translate-x-[10px] opacity-100' : 'opacity-0'} top-[4px] w-max absolute text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}>{gym.name}</span>
    </div>
  )

}

export default WaitlistExportToCSV
