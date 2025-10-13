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
using Microsoft.EntityFrameworkCore.Internal;
using System.Net.Http.Headers;

namespace ssc.Areas.PE.Controllers
{
  [Route("api/pe/[controller]")]
  [ApiController]
  public class UploadPDFController : ControllerBase
  {
    private IMongoDatabase database;

    //GET: api/Dynagraph
   [HttpPost, DisableRequestSizeLimit]
    public async Task<IActionResult> UploadPDF()
    {
      try
      {
        var formCollection = await Request.ReadFormAsync();
        var file = formCollection.Files.First();

        var folderName = Path.Combine("Resources", "Documents");
        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        if (file.Length > 0)
        {
          var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
          var newFileName = DateTime.Now.ToString("yyyyMMddhh") + "_" + fileName;
          var fullPath = Path.Combine(pathToSave, newFileName);
          var dbPath = Path.Combine(folderName, newFileName);
          using (var stream = new FileStream(fullPath, FileMode.Create))
          {
            file.CopyTo(stream);
          }
          return Ok(new { dbPath });
        }
        else
        {
          return BadRequest();
        }
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex}");
      }
    }

  }
}
