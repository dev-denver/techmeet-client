import { privateDecrypt, constants } from "crypto";
import { serverEnv } from "@/lib/config/env";

export function decryptPassword(encryptedBase64: string): string {
  const buffer = Buffer.from(encryptedBase64, "base64");
  const decrypted = privateDecrypt(
    {
      key: serverEnv.authRsaPrivateKey.replace(/\\n/g, "\n"),
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );
  return decrypted.toString("utf8");
}
