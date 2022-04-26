using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class IPRController : ControllerBase
    {
        private readonly IMongoCollection<Daily> _daily;
        private ProjectionDefinition<Daily> _fields_daily;

        public IPRController(IPEDatabaseSettings settings)
        {
            _daily = DailyCommon._daily;
            _fields_daily = DailyCommon._fields_daily;
        }

        [Authorize("PeIPR Read")]
        [HttpGet]
        public ActionResult Get(string well, DateTime date)
        {
            Daily daily = _daily.Find(t => t.well == well && t.date == date).Project<Daily>(_fields_daily).FirstOrDefault();
            List<IPR> ipr = new List<IPR> { };

            if(daily != null)
            {
                daily = DailyCommon.CalculateFields(daily);
                for (int i = 0; i <= 10; i++)
                {
                    ipr.Add(new IPR
                    {
                        index = i + 1,
                        pwf = daily.ps * i / 10,
                        vogel = (i == 0) ? daily.qmax : daily.qmax * (1 - (decimal)0.2 * (daily.ps * i / 10) / daily.ps - (decimal)0.8 * ((daily.ps * i / 10) * (daily.ps * i / 10) / (daily.ps * daily.ps))),
                    });
                }
                decimal? r15 = (decimal)Math.Log10((double)ipr.ElementAt(8).vogel);
                decimal? r16 = (decimal)Math.Log10((double)daily.last_prod_gross);
                decimal? s15 = (decimal)Math.Log10(Math.Pow((double)daily.ps, 2) - Math.Pow((double)ipr.ElementAt(8).pwf, 2));
                decimal? s16 = (decimal)Math.Log10(Math.Pow((double)daily.ps, 2) - Math.Pow((double)daily.pwf, 2));
                decimal? s18 = (s15 - s16) / (r15 - r16);
                decimal? s19 = 1 / s18;
                decimal? fetkovich = daily.last_prod_gross / (decimal)Math.Pow(1 - Math.Pow((double)(daily.pwf / daily.ps), 2), (double)s19);
                decimal? wiggins = (daily.last_prod_wc <= (decimal)50) ? daily.last_prod_gross / (1 - ((decimal)0.52 * daily.pwf / daily.ps) - (decimal)(0.48 * Math.Pow((double)(daily.pwf / daily.ps), 2))) : daily.last_prod_gross / (1 - ((decimal)0.72 * daily.pwf / daily.ps) - (decimal)(0.28 * Math.Pow((double)(daily.pwf / daily.ps), 2)));

                for (int i = 0; i <= 10; i++)
                {
                    ipr.ElementAt(i).fetkovich = (i == 0) ? fetkovich : fetkovich * (decimal)Math.Pow(1 - Math.Pow((double)(ipr.ElementAt(i).pwf / daily.ps), 2), (double)s19);
                    ipr.ElementAt(i).wiggins = (i == 0) ? wiggins : (daily.last_prod_wc <= (decimal)50) ? wiggins * (1 - ((decimal)0.52 * ipr.ElementAt(i).pwf / daily.ps) - (decimal)(0.48 * Math.Pow((double)(ipr.ElementAt(i).pwf / daily.ps), 2))) : wiggins * (1 - ((decimal)0.72 * ipr.ElementAt(i).pwf / daily.ps) - (decimal)(0.28 * Math.Pow((double)(ipr.ElementAt(i).pwf / daily.ps), 2)));
                }
            }

            return Ok(new {
                daily = daily,
                ipr = ipr
            });
        }
    }
}