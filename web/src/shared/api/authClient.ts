import { apiGet, apiPost } from "@/shared/api/httpClient";

export type AuthRole = "trainer" | "business";

export type AuthUser = {
  id: string;
  role: AuthRole;
  display_name: string;
  email: string | null;
};

export type AuthSessionResponse = {
  user: AuthUser;
  is_new_user: boolean;
};

export async function loginWithFirebaseToken({
  idToken,
  role
}: {
  idToken: string;
  role: AuthRole;
}) {
  return apiPost<AuthSessionResponse>("/auth/firebase/login", {
    id_token: idToken,
    role
  });
}

export function getCurrentSession() {
  return apiGet<AuthSessionResponse>("/auth/me");
}

export function logout() {
  return apiPost<void>("/auth/logout");
}
