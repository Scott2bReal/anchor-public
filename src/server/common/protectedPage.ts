import { GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "./get-server-auth-session";

/**
 * Simple gSSP-Page-Protection helper that redirects
 * the user to /auth/signin if the user is not logged in.
 */
export const protectPage = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return { redirect: { destination: "/auth/signin", permanent: false } };
  }
  return { props: {} };
};
