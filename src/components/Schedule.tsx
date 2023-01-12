import { Climber, ClimbingClass, Gym, Offer, WaitlistEntry } from '@prisma/client';
import { ClassDay } from '../types/ClassDay';
import ClassCard from './ClassCard';
import EmailsButton from './EmailsButton';

interface ScheduleProps {
  gym: Gym & { classes: (ClimbingClass & { climbers: Climber[], offers: Offer[], })[], waitlistEntries: WaitlistEntry[] };
}

const Schedule = ({ gym }: ScheduleProps) => {
  const days: Array<ClassDay> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  type ClassByDay =  ClimbingClass & { climbers: Climber[], offers: Offer[] };

  // Can I make an object that contains key of day, value array of classes on that day?
  const classesByDay: { [idx: string]: Array<ClassByDay> } = {
    Monday: new Array<ClassByDay>(),
    Tuesday: new Array<ClassByDay>(),
    Wednesday: new Array<ClassByDay>(),
    Thursday: new Array<ClassByDay>(),
    Friday: new Array<ClassByDay>(),
    Saturday: new Array<ClassByDay>(),
    Sunday: new Array<ClassByDay>(),
  }

  gym.classes.forEach((climbingClass) => {
    classesByDay[climbingClass.day]?.push(climbingClass)
  })

  return (
    <div className="grid grid-cols-7 gap-2 max-h-[75vh] overflow-scroll max-w-[calc(100vw - 256px)] p-4 place-content-between">
      {days.map((day) => {
        const climbers = classesByDay[day]?.map((climbingClass) => { return climbingClass.climbers }).flat();
        return (
          <div
            key={day}
            className='col-auto flex flex-col gap-2 justify-start items-center'
          >
            <h2 className='hover:cursor-default font-bold'>{day}</h2>
            <EmailsButton climbers={climbers ?? []} />
            {classesByDay[day]?.map((climbingClass) => {
              return <ClassCard key={climbingClass.id} climbingClass={climbingClass} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Schedule
