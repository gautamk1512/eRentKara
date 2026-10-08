let sdk: Promise<void> | undefined;

export async function getGoogleCredential(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("Google sign-in is not configured. Please use email and password.");
  if (!sdk) sdk = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => resolve();
    script.onerror = () => { sdk = undefined; reject(new Error("Unable to load Google sign-in.")); };
    document.head.appendChild(script);
  });
  await sdk;
  return new Promise((resolve, reject) => {
    const identity = (window as any).google.accounts.id;
    const timeout = setTimeout(() => reject(new Error("Google sign-in timed out. Please use email and password.")), 60000);
    identity.initialize({ client_id: clientId, callback: (result: { credential?: string }) => {
      clearTimeout(timeout);
      if (result.credential) resolve(result.credential);
      else reject(new Error("Google sign-in did not return a credential."));
    } });
    identity.prompt((notice: any) => {
      if (notice.isNotDisplayed?.() || notice.isSkippedMoment?.()) {
        clearTimeout(timeout);
        reject(new Error("Google sign-in is unavailable. Please use email and password."));
      }
    });
  });
}
