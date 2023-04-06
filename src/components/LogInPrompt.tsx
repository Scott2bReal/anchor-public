import { signIn } from "next-auth/react";
import { useState } from "react";

const LogInPrompt = () => {
  const [discordClicked, setDiscordClicked] = useState(false);
  const [googleClicked, setGoogleClicked] = useState(false);
  return (
    <>
      <div className="relative">
        <h1 className="p-2 text-4xl">FA Youth Rec Management</h1>
        <button
          onClick={() => void signIn("discord")}
          onMouseDown={() => setDiscordClicked(true)}
          onMouseUp={() => setDiscordClicked(false)}
          className={`${
            discordClicked ? "scale-95" : ""
          } m-2 rounded-md bg-gray-800 p-2`}
        >
          Sign In with Discord
        </button>
        <button
          onClick={() => void signIn("google")}
          onMouseDown={() => setGoogleClicked(true)}
          onMouseUp={() => setGoogleClicked(false)}
          className={`${
            googleClicked ? "scale-95" : ""
          } m-2 rounded-md bg-gray-800 p-2`}
        >
          Sign In with Google
        </button>
      </div>
    </>
  );
};

export default LogInPrompt;
