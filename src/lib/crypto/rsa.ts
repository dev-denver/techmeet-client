import { privateDecrypt, constants } from "crypto";
import { serverEnv } from "@/lib/config/env";

/**
 * 클라이언트에서 공개키로 암호화된 base64 문자열을 서버 개인키로 복호화.
 * AUTH_RSA_PRIVATE_KEY 환경변수에 PEM 형식 개인키가 있어야 한다.
 */
export function decryptPassword(encryptedBase64: string): string {
  const buffer = Buffer.from(encryptedBase64, "base64");
  const decrypted = privateDecrypt(
    {
      key: serverEnv.authRsaPrivateKey.replace(/^["']|["']$/g, "").trim().replace(/\\n/g, "\n"),
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );
  return decrypted.toString("utf8");
}
