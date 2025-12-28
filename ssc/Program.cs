using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ssc
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var culture = new System.Globalization.CultureInfo("en-US");
            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;


            CreateWebHostBuilder(args).UseContentRoot(Directory.GetCurrentDirectory()).Build().Run();
            /*var host = new WebHostBuilder()
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseIISIntegration()
            .UseStartup<Startup>()
            .Build();

            host.Run();*/
        }

        // public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        //     WebHost.CreateDefaultBuilder(args)
        //         .UseStartup<Startup>();
        public static IWebHostBuilder CreateWebHostBuilder(string[] args)
        {
            var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";

            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls($"http://0.0.0.0:{port}");
        }


    }
}
