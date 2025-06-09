// utils/jwtVerify.ts

export async function verifyJwtRS256(token: string, pemPublicKey: string): Promise<boolean> {
  // 1. split JWT
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return false;
  }

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlToUint8Array(encodedSignature);

  // 2. Convert PEM to CryptoKey
  const publicKey = await importRsaPublicKey(pemPublicKey);

  // 3. Verify signature
  const encoder = new TextEncoder();
  const verified = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    publicKey,
    signature,
    encoder.encode(data)
  );

  return verified;
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

async function importRsaPublicKey(pem: string): Promise<CryptoKey> {
  const pemBody = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s+/g, "");

  const binaryDer = base64UrlToUint8Array(pemBody);
  const arrayBuffer = binaryDer.buffer.slice(binaryDer.byteOffset, binaryDer.byteOffset + binaryDer.byteLength);

  return await crypto.subtle.importKey(
    "spki",
    arrayBuffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["verify"]
  );
}

