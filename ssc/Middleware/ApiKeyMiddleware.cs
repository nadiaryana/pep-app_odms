using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace ssc.Middleware
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string ApiKeyHeader = "X-API-Key";

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IConfiguration config)
        {
            // Hanya proteksi endpoint /api/sensor
            if (context.Request.Path.StartsWithSegments("/api/sensor"))
            {
                if (!context.Request.Headers.TryGetValue(ApiKeyHeader, out var key))
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("API Key tidak ditemukan.");
                    return;
                }

                if (key != config["ApiKey"])
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("API Key tidak valid.");
                    return;
                }
            }

            await _next(context);
        }
    }
}