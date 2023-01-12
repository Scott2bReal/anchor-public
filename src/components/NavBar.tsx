import Link from "next/link";
// import Search from "./Search";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";

const NavBar = () => {
  const { data: session } = useSession()

  return session ? (
    <nav className="bg-blue-900">
      <div className="xl:max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex items-center">
              <Link href="/">
                <a className="gap-4 flex items-center mr-2">
                  <CalendarDaysIcon className="h-9 w-9" />
                  <span>Schedule</span>
                </a>
              </Link>
            </div>
            <div className="flex items-center">primary nav</div>
          </div>
          <div><SignOutButton /></div>
        </div>
      </div>
    </nav>
  ) : (
    <div></div>
  )
}

export default NavBar
