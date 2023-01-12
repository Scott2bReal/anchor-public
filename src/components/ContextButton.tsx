import { useAtom } from "jotai"
import { classTypeAtom } from "../utils/atoms/classTypeAtom"
import WaitlistButton from "./WaitlistButton"

interface contextButtonProps {
  context: string,
  climberId: string,
  gymId: string,
}

const ContextButton = ({ context, climberId, gymId }: contextButtonProps) => {
  const [classType] = useAtom(classTypeAtom)

  if (context === '/waitlist') {
    // TODO refactor this into waitlistbutton component
    return (
      <WaitlistButton climberId={climberId} gymId={gymId} classType={classType} />
    )
  } else {
    return <></>
  }
}

export default ContextButton
