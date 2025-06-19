public async Task<T> ExecuteWithReconnectAsync<T>(Func<NpgsqlConnection, Task<T>> operation)
{
    try
    {
        using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();
        return await operation(conn);
    }
    catch (NpgsqlException ex) when (ex.IsTransient || ex.InnerException?.Message.Contains("broken") == true)
    {
        Console.WriteLine("Detected broken connection. Retrying...");

        using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();
        return await operation(conn);
    }
}
