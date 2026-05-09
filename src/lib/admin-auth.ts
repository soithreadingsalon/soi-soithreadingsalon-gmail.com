const KEY = "soi_admin_session";
export const ADMIN_USER = "soi";
export const ADMIN_PASS = "Soi@wayne2026";

export function loginAdmin(u: string, p: string) {
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    if (typeof window !== "undefined") localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}
export function isAdmin() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}
export function logoutAdmin() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}