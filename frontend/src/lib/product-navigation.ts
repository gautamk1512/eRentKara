/** Keep navigation, footer and visual accents aligned with the active product. */
export function isAgreementRoute(path: string, search = "") {
  const query = new URLSearchParams(search);
  if (path === "/contact" || path.startsWith("/tools")) return query.get("portal") === "agreement" || (path === "/contact" && query.get("portal") !== "rental");
  if (path === "/login" || path === "/register") {
    const portal = query.get("portal");
    if (portal) return portal === "agreement" || portal === "partner";
    const next = query.get("next") || "";
    return /^\/(rent-agreement|agreement|partner|dashboard\/orders|owner\/dashboard)(\/|$|\?)/.test(next);
  }
  if (path === "/guide" || path === "/user-manual") return query.get("tab") !== "rental";
  if (["/owner/dashboard", "/tenant/dashboard", "/shop/dashboard", "/admin/rent-agreements"].includes(path)) return true;
  if (/^\/(rental|properties|property-in|dashboard|tenant|owner|shop|admin|tools|features|solutions|start-managing-free|list-your-property|promotions|pricing)(\/|$)/.test(path)) return path.startsWith("/dashboard/orders");
  return true;
}
