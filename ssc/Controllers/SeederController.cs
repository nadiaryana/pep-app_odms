using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ssc.Models;
using System.Collections.Generic;

namespace ssc.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SeederController : ControllerBase
  {
    private readonly IMongoCollection<User> _users;

    public SeederController(ICommonDatabaseSettings settings)
    {
      var client = new MongoClient(settings.ConnectionString);
      var database = client.GetDatabase(settings.DatabaseName);
      _users = database.GetCollection<User>("users");
    }

    [HttpPost("seed-users")]
    public IActionResult SeedUsers()
    {
      var users = new List<User>
            {
                new User
                {
                    username = "pe.viewer",
                    email = "",
                    display_name = "Viewer",
                    role = "ssa-viewer",
                    password_hash = BCrypt.Net.BCrypt.HashPassword("Pertamina@2025")
                },
                new User
                {
                    username = "pe.admin",
                    email = "",
                    display_name = "Admin",
                    role = "ssa-pe-ro",
                    password_hash = BCrypt.Net.BCrypt.HashPassword("Pertamina@2025")
                }
            };

      _users.InsertMany(users);
      return Ok(new { message = "✅ Users seeded successfully." });
    }
  }
}
