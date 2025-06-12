import forge from 'node-forge';

function base64urlToBytes(base64url: string): string {
  return forge.util.decode64(
    base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(base64url.length / 4) * 4, '=')
  );
}

function createPublicKeyPem(n: string, e: string): string {
  const nBytes = base64urlToBytes(n);
  const eBytes = base64urlToBytes(e);

  const modulus = new forge.jsbn.BigInteger(forge.util.bytesToHex(nBytes), 16);
  const exponent = new forge.jsbn.BigInteger(forge.util.bytesToHex(eBytes), 16);

  const publicKey = forge.pki.setRsaPublicKey(modulus, exponent);
  const pem = forge.pki.publicKeyToPem(publicKey);
  return pem;
}

// 사용 예시 (n, e는 base64url 문자열)
const jwk = {
  n: 'sXchQbM...base64url...',  // 실제 base64url 인코딩된 modulus
  e: 'AQAB',                   // 일반적으로 "AQAB" == 65537
};

const pem = createPublicKeyPem(jwk.n, jwk.e);
console.log(pem);
