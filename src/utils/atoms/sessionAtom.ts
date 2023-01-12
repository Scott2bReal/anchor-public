import { ClimbingSession } from "@prisma/client";
import { atom } from "jotai";

export const sessionAtom = atom<ClimbingSession | null>(null);
