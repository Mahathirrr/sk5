export interface AuthUser {
  email: string;
  [key: string]: any;
}

export interface AuthAccount {
  provider: string;
  [key: string]: any;
}

export interface SignInParams {
  user: AuthUser;
  account: AuthAccount;
}

export interface SessionUser {
  id?: string;
  [key: string]: any;
}

export interface AuthSession {
  user?: SessionUser;
  [key: string]: any;
}

export interface SessionParams {
  session: AuthSession;
  user: {
    id: string;
    [key: string]: any;
  };
}

export interface AuthProviders {
  google: {
    scopes: string[];
  };
  github: {
    scopes: string[];
  };
}

export interface AuthPages {
  signIn: string;
  signOut: string;
  error: string;
  verifyRequest: string;
}
