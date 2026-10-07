/** Browser requests stay on the website origin, including in production builds. */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") return "/api/v1";
  return (process.env.BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "") + "/api/v1";
}
