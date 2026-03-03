export async function encryptPassword(password: string, publicKeyPem: string): Promise<string> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemBody = publicKeyPem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");

  const der = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "spki",
    der.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    cryptoKey,
    new TextEncoder().encode(password)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
