using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using MongoDB.Driver;
using MongoDB.Bson;
using ssc.Models;

namespace ssc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Region> _regions;
        private readonly IHttpClientFactory _clientFactory;
        private ProjectionDefinition<Region> _fields_region;
        private string url;

        public RegionController(ICommonDatabaseSettings settings, IHttpClientFactory clientFactory)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase("common");
            _regions = database.GetCollection<Region>("region");
            _fields_region = Builders<Region>.Projection
                .Include(r => r.id)
                .Include(r => r.name)
                .Include(r => r.parent_id)
                .Include(r => r.type);

            url = "http://dev.farizdotid.com/api/daerahindonesia/provinsi";
            _clientFactory = clientFactory;
        }

        [HttpGet]
        public ActionResult Get(string type, string id = null)
        {
            Task<string> raw;
            List<RegionList> rl;
            bool res;
            RegionList first;
            Region reg;

            if (type == "kabupaten")
            {
                if (String.IsNullOrEmpty(id))
                {
                    string[] kab_ids = HttpContext.Session.GetString("kab_ids").Split(",");
                    int kab_idx = HttpContext.Session.GetInt32("kab_idx").Value;
                    if(kab_idx < kab_ids.Length)
                    {
                        id = kab_ids[kab_idx];
                        reg = _regions.Find(r => r.id == id).Project<Region>(_fields_region).FirstOrDefault();
                        HttpContext.Session.SetInt32("kab_idx", kab_idx + 1);
                        return Content("<script>setTimeout(function(){location.href=\"/api/region?id=" + reg.id + "&type=kecamatan\"}, 2000)</script>Loading " + reg.name + "...", "text/html");
                    } else
                    {
                        return Get("provinsi");
                    }
                } else
                {
                    raw = GetURL(url + "/" + id + "/kabupaten");
                    rl = JsonConvert.DeserializeObject<RegionLoad>(raw.Result).kabupatens.ToList();
                    res = Post(rl);
                    HttpContext.Session.SetString("kab_ids", String.Join(",", rl.Select(r => r.id).ToArray()));
                    HttpContext.Session.SetInt32("kab_idx", 0);
                    return Get("kabupaten");
                }
            }
            else if (type == "kecamatan")
            {
                if (String.IsNullOrEmpty(id))
                {
                    string[] kec_ids = HttpContext.Session.GetString("kec_ids").Split(",");
                    int kec_idx = HttpContext.Session.GetInt32("kec_idx").Value;
                    if(kec_idx < kec_ids.Length)
                    {
                        id = kec_ids[kec_idx];
                        reg = _regions.Find(r => r.id == id).Project<Region>(_fields_region).FirstOrDefault();
                        HttpContext.Session.SetInt32("kec_idx", HttpContext.Session.GetInt32("kec_idx").Value + 1);
                        return Content("<script>setTimeout(function(){location.href=\"/api/region?id=" + reg.id + "&type=desa\"}, 2000)</script>Loading " + reg.name + "...", "text/html");
                    }
                    else
                    {
                        return Get("kabupaten");
                    }
                }
                else
                {
                    raw = GetURL(url + "/kabupaten/" + id + "/kecamatan");
                    rl = JsonConvert.DeserializeObject<RegionLoad>(raw.Result).kecamatans.ToList();
                    res = Post(rl);
                    HttpContext.Session.SetString("kec_ids", String.Join(",", rl.Select(r => r.id).ToArray()));
                    HttpContext.Session.SetInt32("kec_idx", 0);
                    return Get("kecamatan");
                }
            } else if (type == "desa")
            {
                raw = GetURL(url + "/kabupaten/kecamatan/" + id + "/desa");
                rl = JsonConvert.DeserializeObject<RegionLoad>(raw.Result).desas.ToList();
                res = Post(rl);
                return Get("kecamatan");
            }
            else
            {
                if (type == "provinsi")
                {
                    string[] prov_ids = HttpContext.Session.GetString("prov_ids").Split(",");
                    int prov_idx = HttpContext.Session.GetInt32("prov_idx").Value;
                    if (prov_idx < prov_ids.Length)
                    {
                        id = prov_ids[prov_idx];
                        reg = _regions.Find(r => r.id == id).Project<Region>(_fields_region).FirstOrDefault();
                        HttpContext.Session.SetInt32("prov_idx", prov_idx + 1);
                        return Content("<script>setTimeout(function(){location.href=\"/api/region?id=" + reg.id + "&type=kabupaten\"}, 2000)</script>Loading " + reg.name + "...", "text/html");
                    }
                    else
                    {
                        return Content("Finish");
                    }
                }
                else
                {
                    raw = GetURL(url);
                    rl = JsonConvert.DeserializeObject<RegionLoad>(raw.Result).semuaprovinsi.ToList();
                    res = Post(rl);
                    HttpContext.Session.SetString("prov_ids", String.Join(",", rl.Select(r => r.id).ToArray()));
                    HttpContext.Session.SetInt32("prov_idx", 16);
                    return Get("provinsi");
                }
            }
        }

        [HttpPost]
        public bool Post(List<RegionList> items)
        {
            try
            {
                long modified_count = 0;
                long created_count = items.Count();

                foreach (RegionList item in items)
                {
                    string type;
                    if (!String.IsNullOrEmpty(item.id_prov))
                    {
                        if (item.nama.ToLower().StartsWith("kota"))
                        {
                            type = "kota";
                        }
                        else
                        {
                            type = "kabupaten";
                        }
                    }
                    else if (!String.IsNullOrEmpty(item.id_kabupaten))
                    {
                        type = "kecamatan";
                    }
                    else if (!String.IsNullOrEmpty(item.id_kecamatan))
                    {
                        type = "desa";
                    }
                    else
                    {
                        type = "provinsi";
                    }
                    var update = Builders<Region>.Update
                        .Set(r => r.id, item.id)
                        .Set(r => r.name, item.nama)
                        .Set(r => r.type, type);

                    UpdateResult res = _regions.UpdateOne(
                        Builders<Region>.Filter.Eq(t => t.id, item.id),
                        update, new UpdateOptions() { IsUpsert = true });

                    modified_count += res.ModifiedCount;
                    created_count -= res.ModifiedCount;
                }

                return true;

            } catch(Exception e)
            {
                return false;
            };
        }

        private async Task<string> GetURL(string path)
        {
            HttpRequestMessage request;
            request = new HttpRequestMessage(HttpMethod.Get, path);

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                //string ctype = response.Content.Headers.ContentType.ToString();
                //Response.ContentType = ctype;
                var str = await response.Content.ReadAsStringAsync();
                return str;
            }
            else
            {
                return String.Empty;
            }
        }
    }
}