import { SignInParams, SessionParams } from "./types";

export const signInCallback = async ({
  user,
}: SignInParams): Promise<boolean> => {
  if (!user.email) {
    return false;
  }
  return true;
};

export const sessionCallback = async ({ session, user }: SessionParams) => {
  if (session?.user) {
    session.user.id = user.id;
  }
  return session;
};
