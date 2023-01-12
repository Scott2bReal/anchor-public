import { Dialog } from "@headlessui/react"
import { Climber, CampWeek } from "@prisma/client"
import { useState } from "react"

interface Props {
  campWeek: CampWeek & { climbers: Climber[] }
}

export const CampWeekCard = ({ campWeek }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className='h-64 w-64 text-center bg-green-600 rounded-lg '>
        <h2>Week {campWeek.weekNumber}</h2>
      </div>
      {/* <Dialog */}
      {/*   open={isOpen} */}
      {/*   onClose={() => setIsOpen(false)} */}
      {/* > */}
      {/*   <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' /> */}
      {/*   <div */}
      {/*     className='z-[4] fixed inset-0 items-center flex justify-center rounded-lg p-4' */}
      {/*   > */}
      {/*     <Dialog.Panel */}
      {/*       className='z-[4] p-6 mx-auto relative rounded-lg bg-neutral-800 flex flex-col items-center shadow-md shadow-neutral-900 overflow-scroll h-[95vh]' */}
      {/*     > */}
      {/*       <ClassInfo climbingClass={climbingClass} onRequestClose={toggleIsOpen} /> */}
      {/*       <div className='relative flex flex-col gap-2 justify-center items-center h-max' > */}
      {/*         <div className='flex justify-center'> */}
      {/*           <ClassRoster climbingClass={climbingClass} /> */}
      {/*           {climbingClass.offers.length > 0 */}
      {/*             ? <div className='flex flex-col justify-between h-full'> */}
      {/*               <OfferList classId={climbingClass.id} /> */}
      {/*             </div> */}
      {/*             : */}
      {/*             <></> */}
      {/*           } */}
      {/*         </div> */}
      {/*         <div className={`flex flex-col gap-2 justify-center items-center`} > */}
      {/*           {climber ? <></> : <h2>Select a Climber below</h2>} */}
      {/*           <Search /> */}
      {/*           {climber ? <h2>Enroll or Make an Offer for <span className='font-extrabold'>{climber.name}</span></h2> : <></>} */}
      {/*         </div> */}
      {/*         <div className='flex gap-4 w-full' > */}
      {/*           {climber ? <EnrollClimberButton climber={climber} climbingClass={climbingClass} onRequestClose={toggleIsOpen} availableForEnrollments={availableForEnrollments} /> : <></>} */}
      {/*           {climber ? <OfferButton climber={climber} climbingClass={climbingClass} availableForOffers={availableForOffers} /> : <></>} */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </Dialog.Panel> */}
      {/**/}
      {/*   </div> */}
      {/* </Dialog> */}
    </>
  )
}
