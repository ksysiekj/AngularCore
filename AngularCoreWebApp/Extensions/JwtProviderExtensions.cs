using AngularCoreWebApp.Infrastructure;
using Microsoft.AspNetCore.Builder;

namespace AngularCoreWebApp.Extensions
{
    internal static class JwtProviderExtensions
    {
        internal static IApplicationBuilder UseJwtProvider(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtProvider>();
        }
    }
}
