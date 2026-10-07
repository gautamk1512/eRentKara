export async function downloadDocument(url: string, filename: string) {
  const target = new URL(url, window.location.origin);
  if (target.origin !== window.location.origin) throw new Error("Invalid document download URL.");
  const response = await fetch(target, { headers: { Authorization: `Bearer ${localStorage.getItem("erk_token") || ""}` } });
  if (!response.ok) throw new Error("Unable to download this document. Please sign in and try again.");
  const blobUrl = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
