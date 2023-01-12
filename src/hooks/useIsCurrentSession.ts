import { useAtom } from "jotai";
import { sessionAtom } from "../utils/atoms/sessionAtom";

export default function useIsCurrentSession() {
  const [selectedSession] = useAtom(sessionAtom)

  return selectedSession?.current as boolean
}
