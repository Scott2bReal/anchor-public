import { Climber, ClimbingClass } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import useDeleteOffer from "../hooks/useDeleteOffer";
import useLogger from "../hooks/useLogger";
import useRemoveFromWaitlist from "../hooks/waitlist-hooks/useRemoveFromWaitlist";
import { trpc } from "../utils/trpc";

type EnrollClimberButtonProps = {
  climber: Climber;
  climbingClass: ClimbingClass;
  onRequestClose: () => void;
availableForEnrollments: boolean;
}

export default function EnrollClimberButton({ climber, climbingClass, availableForEnrollments }: EnrollClimberButtonProps) {
  const ctx = trpc.useContext()
  const { data: session } = useSession()
  const user = session?.user
  const logger = useLogger()
  const { gymId, className } = climbingClass

  const { data: offer } = trpc.offers.getByClimberAndClass.useQuery({ climberId: climber.id, classId: climbingClass.id })
  const { data: waitlistEntry } = trpc.waitlist.getEntriesForClimberAndClassType.useQuery({ climberId: climber.id, gymId: gymId, classType: className })

  const removeFromWaitlist = useRemoveFromWaitlist({ classType: climbingClass.className })
  const deleteOffer = useDeleteOffer(null)

  const enrollClimber = trpc.climber.enrollClimber.useMutation({
    onMutate: async () => {
      toast.loading('Enrolling climber...')
      await ctx.offers.getByGym.cancel()
      await ctx.gyms.getById.cancel()
      await ctx.offers.getByClimberAndClass.cancel()
      await ctx.offers.getById.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.offers.getByGym.invalidate()
      ctx.gyms.getById.invalidate()
      ctx.offers.getByClimberAndClass.invalidate()
      ctx.offers.getById.invalidate()
      ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      if (offer) {
        deleteOffer.mutate({ offerId: offer.id })
        logger.mutate({
          climberId: climber.id,
          message: `${offer.user.name} - Rescinded offer`
        })

      }

      if (waitlistEntry) {
        removeFromWaitlist.mutate({ waitlistId: waitlistEntry.id })
      }

      toast.success('Enrolled climber!')

      logger.mutate({
        climberId: climber.id,
        message: `${user?.name} - Enrolled in a ${climbingClass?.className} class`
      })
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })

  return availableForEnrollments ? (
    <button
      className={`p-2 flex-1 rounded-lg bg-gray-800 hover:scale-95 shadow-md shadow-neutral-900 transition duration-150`}
      onClick={() => {
        enrollClimber.mutate({
          id: climber.id,
          classId: climbingClass.id,
        })
      }}

    >Enroll</button>
  ) : (
    <button
      className={`p-2 opacity-50 flex-1 rounded-lg bg-gray-800 shadow-md shadow-neutral-900`}
      disabled
    >Enroll</button>
  )
}
