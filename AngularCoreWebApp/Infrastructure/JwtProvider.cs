using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AngularCoreWebApp.Data.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace AngularCoreWebApp.Infrastructure
{
    public sealed class JwtProvider
    {
        private readonly RequestDelegate _next;

        private readonly TimeSpan _tokenExpiration;
        private readonly SigningCredentials _signingCredentials;
        private readonly UserManager<ApplicationUser> _userManager;


        private const string PrivateKey = "private_key_1234567890";
        public static readonly SymmetricSecurityKey SecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(PrivateKey));
        public const string Issuer = "OpenGameList";
        public const string TokenEndPoint = "/api/connect/token";

        public JwtProvider(RequestDelegate next, UserManager<ApplicationUser> userManager)
        {
            _next = next;
            _userManager = userManager;
            _tokenExpiration = TimeSpan.FromMinutes(10);
            _signingCredentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.HmacSha256);
        }

        public Task Invoke(HttpContext httpContext)
        {
            if (!string.Equals(httpContext.Request.Path, TokenEndPoint, StringComparison.Ordinal))
            {
                return _next(httpContext);
            }

            if (httpContext.Request.Method == "POST" && httpContext.Request.HasFormContentType)
            {
                return CreateToken(httpContext);
            }

            httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            return httpContext.Response.WriteAsync("Bad request");
        }

        private async Task CreateToken(HttpContext httpContext)
        {
            string username = httpContext.Request.Form["username"];
            string password = httpContext.Request.Form["password"];

            ApplicationUser user = await _userManager.FindByNameAsync(username);
            if (user == null && username.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(username);
            }

            bool success = user != null && await _userManager.CheckPasswordAsync(user, password);
            if (!success)
            {
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync("Invalid username and/or password");
                return;
            }

            DateTime now = DateTime.UtcNow;
            Claim[] claims = {
                        new Claim(JwtRegisteredClaimNames.Iss,Issuer),
                        new Claim(JwtRegisteredClaimNames.Sub,user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat,new DateTimeOffset(now).ToUnixTimeSeconds().ToString(),ClaimValueTypes.Integer64)
                    };

            JwtSecurityToken token = new JwtSecurityToken(claims: claims, notBefore: now, expires: now.Add(_tokenExpiration),
                signingCredentials: _signingCredentials);

            string encodedToken = new JwtSecurityTokenHandler().WriteToken(token);

            var jwt = new
            {
                access_token = encodedToken,
                expiration = (int)_tokenExpiration.TotalSeconds
            };

            httpContext.Response.ContentType = "application/json";
            await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(jwt));
        }
    }
}
