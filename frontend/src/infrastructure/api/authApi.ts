import { requestJson } from "./http";

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
};

export type AuthLoginResponse = {
  session: AuthSession;
};

export type AuthMeResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};

export function loginWithPassword(email: string, password: string) {
  return requestJson<AuthLoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentSession(token: string) {
  return requestJson<AuthMeResponse>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function logout() {
  return requestJson<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}
