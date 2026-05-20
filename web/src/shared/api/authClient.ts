import { apiPost } from "@/shared/api/httpClient";

export type AuthRole = "trainer" | "business";

export type FirebaseLoginResponse = {
  user_id: string;
  provider: "google";
  role: AuthRole;
  display_name: string;
  email: string | null;
  is_new_user: boolean;
};

export async function loginWithFirebaseToken({
  idToken,
  role
}: {
  idToken: string;
  role: AuthRole;
}) {
  return apiPost<FirebaseLoginResponse>("/auth/firebase/login", {
    id_token: idToken,
    role
  });
}
