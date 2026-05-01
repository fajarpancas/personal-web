async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getOrCreateLocalId(): string {
  const KEY = "__device_uid";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export async function getDeviceId(): Promise<string> {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(",") ?? "",
    screen.width,
    screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency ?? "",
    (navigator as unknown as Record<string, unknown>)["deviceMemory"] ?? "",
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.platform ?? "",
  ].join("|");

  const fpHash = await sha256(fingerprint);
  const localId = getOrCreateLocalId();
  const combined = await sha256(fpHash + "|" + localId);
  return combined.slice(0, 32);
}
