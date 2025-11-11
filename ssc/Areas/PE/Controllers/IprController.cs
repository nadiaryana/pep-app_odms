using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ssc.Areas.PE.Models;
using System.Globalization;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using Microsoft.AspNetCore.Mvc;
// using ssc.Data;
using System.Linq;
using System.Threading.Tasks;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class IprController : ControllerBase
    {
        //     private readonly ApplicationDbContext _context;

        //     public IprController(ApplicationDbContext context)
        //     {
        //         _context = context;
        //     }

        //     // test API
        //     [HttpGet("ping")]
        //     public IActionResult Ping()
        //     {
        //         return Ok("IPR Controller OK");
        //     }
    }
}

