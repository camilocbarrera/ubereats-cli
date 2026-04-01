import { loadConfig } from "../config";
import { getUser } from "../services/auth";
import { printDetail, withSpinner, dim } from "../ui";

const config = await loadConfig();
const user = await withSpinner("Loading profile...", () => getUser(config));

function mask(value: string, visibleStart = 3, visibleEnd = 2): string {
  if (value.length <= visibleStart + visibleEnd) return value;
  const end = visibleEnd > 0 ? value.slice(-visibleEnd) : "";
  return value.slice(0, visibleStart) + "\u2022".repeat(value.length - visibleStart - visibleEnd) + end;
}

const maskedEmail = user.email
  ? mask(user.email.split("@")[0]) + "@" + user.email.split("@")[1]
  : "--";
const maskedPhone = user.phone
  ? "\u2022".repeat(user.phone.length - 4) + user.phone.slice(-4)
  : "--";

printDetail("Your Profile", [
  ["Name", user.name],
  ["Email", maskedEmail],
  ["Phone", maskedPhone],
  ["User ID", user.userId ? mask(user.userId) : "--"],
  ["Coords", `${config.lat.toFixed(2)}, ${config.lng.toFixed(2)}`],
]);
