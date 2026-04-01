import type { UberEatsConfig } from "../schemas/config";
import type { UberEatsUser } from "../schemas/auth";
import { post } from "../http";

export async function getUser(config: UberEatsConfig): Promise<UberEatsUser> {
  const raw = await post<any>("/_p/api/getActiveOrdersV1", {}, config);

  // Extract user info from cookies or use a profile endpoint
  const data = await post<any>("/_p/api/getProfilesForUserV1", {}, config);

  const profiles = data?.data?.profiles || data?.profiles || [];
  const active = profiles[0];

  return {
    name: active?.firstName
      ? `${active.firstName} ${active.lastName || ""}`
      : "Uber Eats User",
    email: active?.email || "",
    userId: active?.uuid || "",
    phone: active?.phoneNumber || "",
  };
}
