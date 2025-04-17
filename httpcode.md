public static class HttpStatusDictionary
{
    public static readonly Dictionary<int, HttpStatus> Statuses = new()
    {
        { 100, new HttpStatus { Code = 100, Phrase = "Continue", Description = "Request received, please continue" } },
        { 101, new HttpStatus { Code = 101, Phrase = "Switching Protocols", Description = "Switching to new protocol; obey Upgrade header" } },
        { 102, new HttpStatus { Code = 102, Phrase = "Processing", Description = "WebDAV; RFC 2518" } },
        { 103, new HttpStatus { Code = 103, Phrase = "Early Hints", Description = "Used to return some response headers before final HTTP message" } },
        { 200, new HttpStatus { Code = 200, Phrase = "OK", Description = "Request fulfilled, document follows" } },
        { 201, new HttpStatus { Code = 201, Phrase = "Created", Description = "Document created, URL follows" } },
        { 202, new HttpStatus { Code = 202, Phrase = "Accepted", Description = "Request accepted, processing continues off-line" } },
        { 203, new HttpStatus { Code = 203, Phrase = "Non-Authoritative Information", Description = "Request fulfilled from cache" } },
        { 204, new HttpStatus { Code = 204, Phrase = "No Content", Description = "Request fulfilled, nothing follows" } },
        { 205, new HttpStatus { Code = 205, Phrase = "Reset Content", Description = "Clear input form for further input." } },
        { 206, new HttpStatus { Code = 206, Phrase = "Partial Content", Description = "Partial content follows." } },
        { 207, new HttpStatus { Code = 207, Phrase = "Multi-Status", Description = "WebDAV; RFC 4918" } },
        { 208, new HttpStatus { Code = 208, Phrase = "Already Reported", Description = "WebDAV; RFC 5842" } },
        { 226, new HttpStatus { Code = 226, Phrase = "IM Used", Description = "RFC 3229" } },
        { 300, new HttpStatus { Code = 300, Phrase = "Multiple Choices", Description = "Object has several resources" } },
        { 301, new HttpStatus { Code = 301, Phrase = "Moved Permanently", Description = "Object moved permanently" } },
        { 302, new HttpStatus { Code = 302, Phrase = "Found", Description = "Object moved temporarily" } },
        { 303, new HttpStatus { Code = 303, Phrase = "See Other", Description = "Object moved, see Method and URL list" } },
        { 304, new HttpStatus { Code = 304, Phrase = "Not Modified", Description = "Document has not changed since given time" } },
        { 305, new HttpStatus { Code = 305, Phrase = "Use Proxy", Description = "You must use proxy specified in Location to access this resource." } },
        { 307, new HttpStatus { Code = 307, Phrase = "Temporary Redirect", Description = "Object moved temporarily" } },
        { 308, new HttpStatus { Code = 308, Phrase = "Permanent Redirect", Description = "Object moved permanently" } },
        { 400, new HttpStatus { Code = 400, Phrase = "Bad Request", Description = "Bad request syntax or unsupported method" } },
        { 401, new HttpStatus { Code = 401, Phrase = "Unauthorized", Description = "No permission -- see authorization schemes" } },
        { 402, new HttpStatus { Code = 402, Phrase = "Payment Required", Description = "No payment -- see charging schemes" } },
        { 403, new HttpStatus { Code = 403, Phrase = "Forbidden", Description = "Request forbidden -- authorization will not help" } },
        { 404, new HttpStatus { Code = 404, Phrase = "Not Found", Description = "Nothing matches the given URI" } },
        { 405, new HttpStatus { Code = 405, Phrase = "Method Not Allowed", Description = "Specified method is invalid for this server." } },
        { 406, new HttpStatus { Code = 406, Phrase = "Not Acceptable", Description = "URI not available in preferred format." } },
        { 407, new HttpStatus { Code = 407, Phrase = "Proxy Authentication Required", Description = "You must authenticate with this proxy before proceeding." } },
        { 408, new HttpStatus { Code = 408, Phrase = "Request Timeout", Description = "Client took too long to send request" } },
        { 409, new HttpStatus { Code = 409, Phrase = "Conflict", Description = "Request conflict" } },
        { 410, new HttpStatus { Code = 410, Phrase = "Gone", Description = "URI no longer exists and has been permanently removed." } },
        { 411, new HttpStatus { Code = 411, Phrase = "Length Required", Description = "Client must specify Content-Length." } },
        { 412, new HttpStatus { Code = 412, Phrase = "Precondition Failed", Description = "Precondition in headers is false." } },
        { 413, new HttpStatus { Code = 413, Phrase = "Payload Too Large", Description = "Entity is too large." } },
        { 414, new HttpStatus { Code = 414, Phrase = "URI Too Long", Description = "URI is too long." } },
        { 415, new HttpStatus { Code = 415, Phrase = "Unsupported Media Type", Description = "Entity body in unsupported format." } },
        { 416, new HttpStatus { Code = 416, Phrase = "Range Not Satisfiable", Description = "Cannot satisfy request range." } },
        { 417, new HttpStatus { Code = 417, Phrase = "Expectation Failed", Description = "Expect condition could not be satisfied." } },
        { 418, new HttpStatus { Code = 418, Phrase = "I'm a teapot", Description = "RFC 2324" } },
        { 421, new HttpStatus { Code = 421, Phrase = "Misdirected Request", Description = "Server is not able to produce a response." } },
        { 422, new HttpStatus { Code = 422, Phrase = "Unprocessable Entity", Description
::contentReference[oaicite:2]{index=2}
 


public class HttpStatus
{
    public int Code { get; set; }
    public string Phrase { get; set; }
    public string Description { get; set; }

    public override string ToString() => $"{Phrase} - {Description}";
}





