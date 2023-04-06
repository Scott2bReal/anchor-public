import { Listbox } from "@headlessui/react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import type { ClimbingSession, User } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../utils/api";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  initialDefault: ClimbingSession;
  user: User;
}

export const UserSetDefaultSessionMenu = ({ initialDefault, user }: Props) => {
  const ctx = api.useContext();
  const [selectedSession, setSelectedSession] = useState(initialDefault);
  const [currentDefault, setCurrentDefault] = useState(initialDefault);
  const { data: sessions, isLoading: sessionsLoading } =
    api.climbingSession.getAll.useQuery();
  const showConfirmButton = selectedSession.id !== currentDefault.id;

  const setUserDefault = api.user.setDefaultSession.useMutation({
    onMutate: async () => {
      toast.loading(`Setting your default session...`);
      await ctx.climbingSession.getAll.cancel();
    },
    onSettled: async () => {
      await ctx.climbingSession.getAll.invalidate();
    },
    onError: (e) => {
      toast.dismiss();
      toast.error(e.message);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success(`Changed your default session`);
    },
  });

  if (sessionsLoading) return <LoadingSpinner />;
  if (!sessions) return <div>Couldn&apos;t find any sessions!</div>;

  console.log(`Show Confirm Button: `, showConfirmButton);

  return (
    <>
      <div className="relative p-2">
        <Listbox by="id" value={selectedSession} onChange={setSelectedSession}>
          <Listbox.Button className="rounded-lg bg-gray-800 p-2 text-xl font-extrabold shadow-md shadow-neutral-900">
            <div className="flex items-center justify-center gap-2">
              {`${selectedSession?.name ?? "Select a session"} ${
                selectedSession?.year ?? ""
              }`}
              <CalendarIcon
                className={`${
                  selectedSession?.current ? "block" : "hidden"
                } h-4 w-4`}
              />
              <div
                className={`${selectedSession?.upcoming ? "block" : "hidden"}`}
              >
                <CalendarIcon className="h-4 w-4" />
                <ForwardIcon className="h-4 w-4" />
              </div>
              <ChevronUpDownIcon className="h-6 w-6" />
            </div>
          </Listbox.Button>
          <Listbox.Options className="absolute top-[64px] z-[8] flex w-full flex-col items-center justify-center rounded-lg bg-slate-700">
            {sessions.map((session) => {
              return (
                <Listbox.Option
                  key={session.id}
                  value={session}
                  className="flex w-full items-center justify-start gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500"
                >
                  {`${session.name} ${session.year}`}
                  <CalendarIcon
                    className={`${
                      session.current ? "block" : "hidden"
                    } h-4 w-4`}
                  />
                  <div className={`${session.upcoming ? "block" : "hidden"}`}>
                    <CalendarIcon className="h-4 w-4" />
                    <ForwardIcon className="h-4 w-4" />
                  </div>
                  <CheckIcon className="hidden h-4 w-4 ui-selected:block" />
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
            <button
              onClick={() => {
                if (showConfirmButton) {
                  setUserDefault.mutate({
                    userId: user.id,
                    sessionId: selectedSession.id,
                  });
                  setCurrentDefault(selectedSession);
                }
              }}
              className={`${
                showConfirmButton ? "visible" : "hidden"
              } mx-2 rounded-lg bg-green-600 p-2 text-xl shadow-md shadow-neutral-900 transition-transform duration-300 ease-in-out`}
            >
              Save
            </button>
        </Listbox>
      </div>
    </>
  );
};
