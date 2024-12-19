import { AuthProviders } from "./types";

export const authProviders: AuthProviders = {
  google: {
    scopes: ["email", "profile"],
  },
  github: {
    scopes: ["read:user", "user:email"],
  },
};
