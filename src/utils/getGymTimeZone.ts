import type { Gym } from "@prisma/client";

export function getGymTimeZone(gym: Gym) {
  return gym.name === "Station Square" ? "America/New_York" : "America/Chicago";
}
