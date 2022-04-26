using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Newtonsoft.Json;

namespace ssc.Areas.SSC.Controllers
{
    [Route("api/ssc/[controller]")]
    [ApiController]
    public class ProxyController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private string reloadHTML;

        public ProxyController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            reloadHTML = "<html><head><meta http-equiv='REFRESH' content='5'></head><body>Loading content...</body></html>";
        }

        [Authorize("IctDashboard Read")]
        [HttpGet]
        public async Task<ActionResult> Get(string path)
        {
            HttpRequestMessage request;
            request = new HttpRequestMessage(HttpMethod.Get, path);

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                string ctype = response.Content.Headers.ContentType.ToString();
                Response.ContentType = ctype;
                switch (ctype.Split('/').ElementAt(0))
                {
                    case "text":
                        var str = await response.Content.ReadAsStringAsync();
                        return Content(str);
                    case "image":
                        var content = await response.Content.ReadAsByteArrayAsync();
                        return File(content, ctype);
                }
                return BadRequest();
            }
            else
            {
                return BadRequest();
            }
        }

        [Authorize("IctDashboard Read")]
        [HttpGet("nms")]
        public async Task<ActionResult> GetNms(int ResourceID, string AccountID, string Password, string NetObject="")
        {
            Response.ContentType = "text/html";

            try
            {
                HttpRequestMessage request;
                request = new HttpRequestMessage(HttpMethod.Get,
                "http://nms.pep.pertamina.com/Orion/DetachResource.aspx?ViewID=1&ResourceID=" + ResourceID + "&NetObject=" + NetObject + "&AccountID=" + AccountID + "&Password=" + Password);

                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                client.Dispose();

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    if (!String.IsNullOrWhiteSpace(responseString))
                    {
                        responseString = responseString.Replace("http://nms.pep.pertamina.com/Orion/DetachResource.aspx?", "/api/ssc/proxy/nms?AccountID=" + AccountID + "&Password=" + Password + "&");
                        responseString = responseString.Replace("<head>", "<head><base href='https://nms.pep.pertamina.com/'>");
                        responseString = responseString.Replace("600", "120");
                        Response.ContentType = "text/html";
                        //Response.Headers.Add("Access-Control-Allow-Origin", "*");
                        return Content(responseString);
                    }
                    else
                    {
                        return Content(reloadHTML);
                    }
                }
                else
                {
                    return Content(reloadHTML);
                }
            }
            catch (Exception e)
            {
                return Content(reloadHTML);
            }
        }

        [Authorize("IctDashboard Read")]
        [HttpGet("pandora")]
        public async Task<ActionResult> GetPandora(string nick, string pass)
        {
            Response.ContentType = "text/html";

            try
            {
                HttpResponseMessage response;
                var handler = new HttpClientHandler() { CookieContainer = new CookieContainer() };
                var client = new HttpClient(handler);

                var body = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("nick", nick),
                    new KeyValuePair<string, string>("pass", pass),
                    new KeyValuePair<string, string>("login_button", "Login"),
                };
                response = await client.PostAsync("http://10.206.16.70/pandora_console/index.php?login=1", new FormUrlEncodedContent(body));
                client.Dispose();

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    if (!String.IsNullOrWhiteSpace(responseString))
                    {
                        responseString = responseString.Replace("http://10.206.16.70/", "/api/ssc/proxy?path=http://10.206.16.70/");
                        responseString = responseString.Replace("<head>", "<head><meta http-equiv='REFRESH' content='120; URL=/api/ssc/proxy/pandora?nick="+nick+"&pass="+pass+"' />");//<base href='http://10.206.16.70/pandora_console/'>
                        responseString = responseString.Replace("intro_homepage.start();", "");
                        return Content(responseString);
                    }
                    else
                    {
                        return Content(reloadHTML);
                    }
                }
                else
                {
                    return Content(reloadHTML);
                }
            }
            catch (Exception e)
            {
                return Content(reloadHTML);
            }
        }

        [Authorize("IctDashboard Read")]
        [HttpGet("ipthermo")]
        public async Task<ActionResult> GetIpthermo()
        {
            Response.ContentType = "text/html";

            try
            {
                HttpRequestMessage request;
                request = new HttpRequestMessage(HttpMethod.Get, "http://10.206.16.198/");

                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                client.Dispose();

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    if(!String.IsNullOrWhiteSpace(responseString))
                    {
                        responseString = responseString.Replace("<head>", "<head><base href='http://10.206.16.198/'>");
                        return Content(responseString);
                    } else
                    {
                        return Content(reloadHTML);
                    }
                }
                else
                {
                    return Content(reloadHTML);
                }
            } catch(Exception e)
            {
                return Content(reloadHTML);
            }
            
        }
    }
}
