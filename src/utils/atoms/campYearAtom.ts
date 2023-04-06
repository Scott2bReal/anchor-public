import { atom } from "jotai";

// Automatically sets the default selected campYear to the current year. Make
// sure to check THIS atom vs. the current year elsewhere to maintain global
// state
export const campYearAtom = atom<number>(new Date().getFullYear())
