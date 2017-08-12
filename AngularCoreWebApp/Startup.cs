using System;
using AngularCoreWebApp.Data;
using AngularCoreWebApp.Data.Items;
using AngularCoreWebApp.Data.Users;
using AngularCoreWebApp.Extensions;
using AngularCoreWebApp.ViewModels;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Nelibur.ObjectMapper;

namespace AngularCoreWebApp
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IConfiguration>(
                c => { return Configuration; }
            );

            // Add framework services.
            services.AddMvc();


            services.AddEntityFramework();

            services.AddIdentity<ApplicationUser, IdentityRole>(config =>
            {
                config.User.RequireUniqueEmail = true;
                config.Password.RequireNonAlphanumeric = false;
                config.Cookies.ApplicationCookie.AutomaticChallenge = false;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]);
                    options.UseOpenIddict();
                });

            // Register the OpenIddict services.
            // Note: use the generic overload if you need
            // to replace the default OpenIddict entities.
            services.AddOpenIddict(options =>
            {
                // Register the Entity Framework stores.
                options.AddEntityFrameworkCoreStores<ApplicationDbContext>();
                // Use Json Web Tokens (JWT)
                options.UseJsonWebTokens();
                // Set a custom token endpoint (default is /connect/token)
                options.EnableTokenEndpoint(Configuration["Authentication:OpenIddict:TokenEndPoint"]);
                // Set a custom auth endpoint (default is /connect/authorize)
                options.EnableAuthorizationEndpoint(Configuration["Authentication:OpenIddict:AuthorizationEndPoint"]);
                // Allow client applications to use the grant_type=password flow.
                options.AllowPasswordFlow();
                // Enable support for both authorization & implicit flows
                options.AllowAuthorizationCodeFlow();
                options.AllowImplicitFlow();
                // Allow the client to refresh tokens.
                options.AllowRefreshTokenFlow();
                // Disable the HTTPS requirement (not recommended in production)
                options.DisableHttpsRequirement();
                // Register a new ephemeral key for development.
                // We will register a X.509 certificate in production.
                options.AddEphemeralSigningKey();
            });

            services.AddSingleton<DbSeeder>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, DbSeeder dbSeeder)
        {
            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            //loggerFactory.AddDebug();

            app.UseDefaultFiles();


            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = (context) =>
                {
                    // Disable caching for all static files.
                    context.Context.Response.Headers["Cache-Control"] = Configuration["StaticFiles:Headers:Cache-Control"];
                    context.Context.Response.Headers["Pragma"] = Configuration["StaticFiles:Headers:Pragma"];
                    context.Context.Response.Headers["Expires"] = Configuration["StaticFiles:Headers:Expires"];
                }
            });

            app.UseJwtProvider();

            app.UseIdentity();

            // Add external authentication middleware below. 
            app.UseFacebookAuthentication(new FacebookOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                AppId = Configuration["Authentication:Facebook:AppId"],
                AppSecret = Configuration["Authentication:Facebook:AppSecret"],
                CallbackPath = "/signin-facebook",
                Scope = { "email" }
            });

            app.UseGoogleAuthentication(new GoogleOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                ClientId = Configuration["Authentication:Google:ClientId"],
                ClientSecret = Configuration["Authentication:Google:ClientSecret"],
                CallbackPath = "/signin-google",
                Scope = { "email" }
            });

            app.UseTwitterAuthentication(new TwitterOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                ConsumerKey = Configuration["Authentication:Twitter:ConsumerKey"],
                ConsumerSecret = Configuration["Authentication:Twitter:ConsumerSecret"],
                CallbackPath = "/signin-twitter"
            });

            // Add OpenIddict middleware
            // Note: UseOpenIddict() must be registered after app.UseIdentity() and the external social providers.
            app.UseOpenIddict();

            // Add the Jwt Bearer Header Authentication to validate Tokens
            app.UseJwtBearerAuthentication(new JwtBearerOptions()
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                RequireHttpsMetadata = false,
                Authority = Configuration["Authentication:OpenIddict:Authority"],
                TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = false,
                    ValidateAudience = false
                }
            });


            app.UseMvc();

            // TinyMapper binding configuration
            TinyMapper.Bind<Item, ItemViewModel>();

            // Seed the Database (if needed)
            try
            {
                dbSeeder.SeedAsync().Wait();
            }
            catch (AggregateException e)
            {
                throw new Exception(e.ToString());
            }
        }
    }
}
