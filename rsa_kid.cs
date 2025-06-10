using System;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;
using System.Security.Cryptography.X509Certificates;

class Program
{
    static void Main()
    {
        // 1. RSA 키 생성
        using (var rsa = RSA.Create(2048))
        {
            var key = new RsaSecurityKey(rsa)
            {
                KeyId = GenerateKid(rsa) // 3. kid 생성
            };

            // 2. JWK 객체 만들기
            var jwk = new
            {
                kty = "RSA",
                use = "sig",
                alg = "RS256",
                kid = key.KeyId,
                n = Base64UrlEncode(rsa.ExportParameters(false).Modulus),
                e = Base64UrlEncode(rsa.ExportParameters(false).Exponent)
            };

            string jwkJson = JsonConvert.SerializeObject(jwk, Formatting.Indented);
            Console.WriteLine(jwkJson);

            // 원한다면 private key도 저장
            var privatePem = ExportPrivateKeyPem(rsa);
            System.IO.File.WriteAllText("private.pem", privatePem);

            var publicPem = ExportPublicKeyPem(rsa);
            System.IO.File.WriteAllText("public.pem", publicPem);
        }
    }

    static string GenerateKid(RSA rsa)
    {
        // RFC 7638 thumbprint: hash(n, e)
        var parameters = rsa.ExportParameters(false);
        var json = JsonConvert.SerializeObject(new
        {
            e = Base64UrlEncode(parameters.Exponent),
            kty = "RSA",
            n = Base64UrlEncode(parameters.Modulus)
        });
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(json));
        return Base64UrlEncode(hash);
    }

    static string Base64UrlEncode(byte[] input)
    {
        return Base64UrlEncoder.Encode(input);
    }

    // PEM export helpers
    static string ExportPrivateKeyPem(RSA rsa)
    {
        var privateBytes = rsa.ExportPkcs8PrivateKey();
        var base64 = Convert.ToBase64String(privateBytes);
        return PemFormat("PRIVATE KEY", base64);
    }

    static string ExportPublicKeyPem(RSA rsa)
    {
        var publicBytes = rsa.ExportSubjectPublicKeyInfo();
        var base64 = Convert.ToBase64String(publicBytes);
        return PemFormat("PUBLIC KEY", base64);
    }

    static string PemFormat(string label, string base64)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"-----BEGIN {label}-----");
        for (int i = 0; i < base64.Length; i += 64)
        {
            sb.AppendLine(base64.Substring(i, Math.Min(64, base64.Length - i)));
        }
        sb.AppendLine($"-----END {label}-----");
        return sb.ToString();
    }
}
