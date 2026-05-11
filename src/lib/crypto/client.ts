/**
 * 평문 비밀번호를 서버 공개키로 RSA-OAEP 암호화한 뒤 base64 문자열로 반환.
 * 평문이 네트워크를 거치지 않도록 클라이언트에서 암호화 후 API로 전송한다.
 * 복호화는 서버의 `decryptPassword` (rsa.ts) 에서 처리.
 */
export async function encryptPassword(password: string, publicKeyPem: string): Promise<string> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemBody = publicKeyPem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/[^A-Za-z0-9+/=]/g, "");

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
