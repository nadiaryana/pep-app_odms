using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using ssc.Services;
using System.Globalization;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Text;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok(new
            {
                title = "Pertamina EP Sangatta Field",
                year = DateTime.Now.Year
            });
        }
    }
}
