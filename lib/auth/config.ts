import { authProviders } from "./providers";
import { signInCallback, sessionCallback } from "./callbacks";
import { authPages } from "./pages";

export const authConfig = {
  providers: authProviders,
  callbacks: {
    signIn: signInCallback,
    session: sessionCallback,
  },
  pages: authPages,
};
