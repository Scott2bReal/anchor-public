import type { Climber } from "@prisma/client"
import toast from "react-hot-toast"

  export default function grabClimber(climber: Climber, setSelectedClimberId: () => void) {
    setSelectedClimberId()
    toast.success(`Selected ${climber.name}`)
  }
