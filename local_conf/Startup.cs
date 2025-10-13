using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Oracle.ManagedDataAccess.Client;
using System.Text;
using System.IO;
using ssc.Models;
using ssc.Areas.SSC.Models;
using ssc.Areas.SSC.Services;
using ssc.Areas.PE.Models;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.FileProviders;

namespace ssc
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CommonDatabaseSettings>(
                Configuration.GetSection(nameof(CommonDatabaseSettings)));

            services.AddSingleton<ICommonDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<CommonDatabaseSettings>>().Value);

            services.Configure<SSCDatabaseSettings>(
                Configuration.GetSection(nameof(SSCDatabaseSettings)));

            services.AddSingleton<ISSCDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<SSCDatabaseSettings>>().Value);

            services.Configure<PEDatabaseSettings>(
                Configuration.GetSection(nameof(PEDatabaseSettings)));

            services.AddSingleton<IPEDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<PEDatabaseSettings>>().Value);

            services.AddHttpClient();
            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder => builder.WithOrigins("*"));
            });

            services.AddSingleton<TicketService>();
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());
            services.AddSession();

            var SecretKey = Encoding.ASCII.GetBytes
                 ("YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv");

            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(token =>
            {
                token.RequireHttpsMetadata = false;
                token.SaveToken = true;
                token.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    //Same Secret key will be used while creating the token
                    IssuerSigningKey = new SymmetricSecurityKey(SecretKey),
                    ValidateIssuer = true,
                    //Usually, this is your application base URL
                    ValidIssuer = "https://localhost:44342/",
                    ValidateAudience = true,
                    //Here, we are creating and using JWT within the same application.
                    //In this case, base URL is fine.
                    //If the JWT is created using a web service, then this would be the consumer URL.
                    ValidAudience = "https://localhost:44342/",
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            System.Text.Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseSession();
            //Add JWToken to all incoming HTTP Request Header
            app.Use(async (context, next) =>
            {
                var JWToken = context.Session.GetString("JWToken");

                if (!string.IsNullOrEmpty(JWToken))
                {
                    context.Request.Headers.Add("Authorization", "Bearer " + JWToken);
                }
                await next();
            });
            //Add JWToken Authentication service
            app.UseAuthentication();

            app.UseCors(builder => builder.WithOrigins("*"));


            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });


            // Use For Development Only
            app.UseMvc(routes =>
              {
                  routes.MapRoute(
              name: "default",
              template: "{controller}/{action=Index}/{id?}");
              }); //*/

            app.UseDefaultFiles();

            app.UseSpa(spa =>
                  {
                      // To learn more about options for serving an Angular SPA from ASP.NET Core,
                      // see https://go.microsoft.com/fwlink/?linkid=864501

                      spa.Options.SourcePath = "ClientApp";

                      if (env.IsDevelopment())
                      {
                          spa.UseAngularCliServer(npmScript: "start");
                      }
                  });


            app.Run(async (context) =>
                  {
                      context.Response.ContentType = "text/html";
                      await context.Response.SendFileAsync(Path.Combine(env.WebRootPath, "index.html"));
                  });
        }
    }
}
