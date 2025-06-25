# .NET 8.0 상품 CSV 업로드 및 분류 생성 예제

## 📌 요구사항 요약

- CSV 파일과 JSON 파라미터를 함께 전송받아 상품을 등록
- `production` 테이블은 recursive 구조로 category 계층 포함
- 분류명이 없으면 자동 생성
- CSV 규격:  
  ```
  category1_name,category2_name,category3_name,category4_name,prodution_name,prodution_img_url
  컴퓨터,노트북,조립PC,게이밍노트북,ASUS TUF Gaming A14 FA401UV-RG025,https://img.danawa.com/prod_img/500000/719/954/img/90954719_1.jpg
  ```

---

## 📁 샘플 디렉토리 구조

```
Controllers/
├── ProductController.cs
Services/
├── IProductService.cs
├── ProductService.cs
Models/
├── ProductUploadRequest.cs
├── ProductEntity.cs
├── CategoryEntity.cs
Data/
├── AppDbContext.cs
```

---

## ✅ 1. 모델 정의

```csharp
// Models/ProductUploadRequest.cs
public class ProductUploadRequest
{
    public string UploadedBy { get; set; }
}
```

```csharp
// Models/CategoryEntity.cs
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int? ParentId { get; set; }
    public Category? Parent { get; set; }
    public ICollection<Category> Children { get; set; } = new List<Category>();
}
```

```csharp
// Models/ProductEntity.cs
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}
```

---

## ✅ 2. 서비스 인터페이스

```csharp
// Services/IProductService.cs
public interface IProductService
{
    Task UploadProductsAsync(IFormFile csvFile, ProductUploadRequest jsonData);
}
```

---

## ✅ 3. 서비스 구현

```csharp
// Services/ProductService.cs
public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task UploadProductsAsync(IFormFile csvFile, ProductUploadRequest jsonData)
    {
        using var reader = new StreamReader(csvFile.OpenReadStream(), Encoding.UTF8);
        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (line.StartsWith("category1")) continue;

            var cols = line.Split(',');

            var categoryNames = cols.Take(4).ToArray();
            var productName = cols[4].Trim();
            var imageUrl = cols[5].Trim();

            var finalCategory = await EnsureCategoryHierarchyAsync(categoryNames);

            var product = new Product
            {
                Name = productName,
                ImageUrl = imageUrl,
                CategoryId = finalCategory.Id
            };

            _context.Products.Add(product);
        }

        await _context.SaveChangesAsync();
    }

    private async Task<Category> EnsureCategoryHierarchyAsync(string[] names)
    {
        Category? parent = null;

        foreach (var name in names)
        {
            if (string.IsNullOrWhiteSpace(name)) break;

            var trimmedName = name.Trim();
            var existing = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == trimmedName && c.ParentId == parent?.Id);

            if (existing == null)
            {
                existing = new Category { Name = trimmedName, Parent = parent };
                _context.Categories.Add(existing);
                await _context.SaveChangesAsync();
            }

            parent = existing;
        }

        return parent!;
    }
}
```

---

## ✅ 4. 컨트롤러 구현

```csharp
// Controllers/ProductController.cs
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string json)
    {
        var jsonData = JsonSerializer.Deserialize<ProductUploadRequest>(json);
        if (file == null || jsonData == null)
            return BadRequest("Invalid request");

        await _productService.UploadProductsAsync(file, jsonData);
        return Ok("Upload completed");
    }
}
```

---

## ✅ 5. 참고 사항

- CSV 인코딩은 UTF-8 권장 (BOM 없이)
- 대용량 CSV는 CsvHelper 또는 TextFieldParser 사용 고려
- Entity 관계는 Fluent API로 설정 가능

