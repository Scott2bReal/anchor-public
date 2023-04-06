import { useRouter } from "next/router"
import { useEffect } from "react"
import { useCurrentUser } from "./useCurrentUser"

export const useRedirectForCampPref = () => {
  const router = useRouter()
  const path = router.asPath
  const { data: user } = useCurrentUser()
  const removeCamp = (path: string) => {
    const parts = path.split('/')
    return `/${parts[parts.length - 1] ?? '/schedule'}`
  }

  useEffect(() => {
    if (user?.showCamp && !(/camp/.test(path))) {
      void router.push(`/camp${path}`)
    } else if (!user?.showCamp && /camp/.test(path)) {
      void router.push(removeCamp(path))
    }
  }, [router, user, path])
}
