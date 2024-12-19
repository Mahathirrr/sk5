export const authConfig = {
  providers: {
    google: {
      scopes: ["email", "profile"],
    },
    github: {
      scopes: ["read:user", "user:email"],
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!user.email) {
        return false;
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
};
