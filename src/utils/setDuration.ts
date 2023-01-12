import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'

type SetDurationArgs = {
  startTime: Date
  classType: string
}

export default function setDuration({ startTime, classType }: SetDurationArgs) {
  try {
    const classDurations: { [key: string]: number } = {
      'Rock Warriors': 60,
      'Stone Masters': 90,
      'Teen Club': 90,
      'Rock Hoppers': 60,
      Scramblers: 60,
      'Spider Monkeys': 60,
    }

    // Duration is number of minutes
    const duration = classDurations[classType]
    if (!duration) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Could not find the class type ${classType}`,
      })
    }

    return dayjs(startTime).add(duration, 'minutes').toDate()

  } catch (e) {
    console.log(e)
    throw e
  }
}
