// Sample .NET Core API Project Structure
// Summary:
// - Uses per-subsystem RSA keys
// - Exposes public keys via endpoint
// - Issues JWTs signed with each subsystem's private key

// --- Models ---

public class SubSystemKey
{
    public string SubSystemId { get; set; } = null!;
    public string PrivateKeyPem { get; set; } = null!; // Stored in DB
    public DateTime CreatedAt { get; set; }
}

// --- KeyService.cs ---

public interface IKeyService
{
    Task<(RSAParameters privateKey, RSAParameters publicKey)> GenerateRsaKeyPairAsync();
    string ExportPublicKey(RSAParameters publicKey);
    string ExportPrivateKey(RSAParameters privateKey);
    RSAParameters ImportPrivateKey(string pem);
    RSAParameters ImportPublicKey(string pem);
}

public class KeyService : IKeyService
{
    public async Task<(RSAParameters privateKey, RSAParameters publicKey)> GenerateRsaKeyPairAsync()
    {
        using var rsa = RSA.Create(2048);
        return (rsa.ExportParameters(true), rsa.ExportParameters(false));
    }

    public string ExportPublicKey(RSAParameters publicKey)
    {
        using var rsa = RSA.Create();
        rsa.ImportParameters(publicKey);
        return PemEncoding.Write("PUBLIC KEY", rsa.ExportSubjectPublicKeyInfo());
    }

    public string ExportPrivateKey(RSAParameters privateKey)
    {
        using var rsa = RSA.Create();
        rsa.ImportParameters(privateKey);
        return PemEncoding.Write("PRIVATE KEY", rsa.ExportPkcs8PrivateKey());
    }

    public RSAParameters ImportPrivateKey(string pem)
    {
        using var rsa = RSA.Create();
        rsa.ImportFromPem(pem);
        return rsa.ExportParameters(true);
    }

    public RSAParameters ImportPublicKey(string pem)
    {
        using var rsa = RSA.Create();
        rsa.ImportFromPem(pem);
        return rsa.ExportParameters(false);
    }
}

// --- JwtService.cs ---

public class JwtService
{
    private readonly IKeyService _keyService;
    public JwtService(IKeyService keyService) => _keyService = keyService;

    public string IssueJwt(string subsystemId, RSAParameters privateKey)
    {
        var rsa = RSA.Create();
        rsa.ImportParameters(privateKey);
        var credentials = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256);

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateJwtSecurityToken(
            issuer: "MainSystem",
            audience: "SubSystem",
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: credentials,
            subject: new ClaimsIdentity(new[]
            {
                new Claim("sub", subsystemId),
                new Claim("role", "subsystem")
            })
        );
        return handler.WriteToken(token);
    }
}

// --- Controller Example ---

[ApiController]
[Route("v1/api/sub-system")]
public class SubSystemController : ControllerBase
{
    private readonly IKeyService _keyService;
    private readonly JwtService _jwtService;
    private readonly IDbContext _db; // Assume injected

    public SubSystemController(IKeyService keyService, JwtService jwtService, IDbContext db)
    {
        _keyService = keyService;
        _jwtService = jwtService;
        _db = db;
    }

    [HttpPost("{subSystemId}/keys")]
    public async Task<IActionResult> GenerateKey(string subSystemId)
    {
        var (priv, pub) = await _keyService.GenerateRsaKeyPairAsync();
        var privPem = _keyService.ExportPrivateKey(priv);

        _db.SubSystemKeys.Add(new SubSystemKey
        {
            SubSystemId = subSystemId,
            PrivateKeyPem = privPem,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        return Ok(new { PublicKey = _keyService.ExportPublicKey(pub) });
    }

    [HttpGet("{subSystemId}/keys")]
    public async Task<IActionResult> GetPublicKey(string subSystemId)
    {
        var record = await _db.SubSystemKeys.FirstOrDefaultAsync(x => x.SubSystemId == subSystemId);
        if (record == null) return NotFound();

        var privateKey = _keyService.ImportPrivateKey(record.PrivateKeyPem);
        var publicKeyPem = _keyService.ExportPublicKey(privateKey);

        return Ok(new { PublicKey = publicKeyPem });
    }

    [HttpGet("{subSystemId}/jwt")]
    public async Task<IActionResult> IssueJwt(string subSystemId)
    {
        var record = await _db.SubSystemKeys.FirstOrDefaultAsync(x => x.SubSystemId == subSystemId);
        if (record == null) return NotFound();
        var privateKey = _keyService.ImportPrivateKey(record.PrivateKeyPem);
        var token = _jwtService.IssueJwt(subSystemId, privateKey);
        return Ok(new { Token = token });
    }
}
