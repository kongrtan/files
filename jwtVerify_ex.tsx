import { verifyJwtRS256 } from "./utils/jwtVerify";

const token = localStorage.getItem("jwt_token");
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw...
-----END PUBLIC KEY-----`;

verifyJwtRS256(token!, publicKey).then((isValid) => {
  console.log("JWT 유효성 검사 결과:", isValid);
});
