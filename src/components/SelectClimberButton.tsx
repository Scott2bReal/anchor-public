import { Climber } from "@prisma/client";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { climberAtom } from "../utils/atoms/climberAtom";

type SelectClimberButtonProps = {
  climber: Climber;
}

const SelectClimberButton = ({climber}: SelectClimberButtonProps) => {
  const [, setSelectedClimberId] = useAtom(climberAtom)

  return (
      <button
        className="p-2 rounded-lg bg-gray-800 hover:scale-95 transition duration-150 shadow-md shadow-neutral-900"
        onClick={() => {
          setSelectedClimberId(climber.id)
          toast.success(`Selected ${climber.name}`)
        }}
      >Select this climber!
    </button>
  )
}

export default SelectClimberButton
