using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ssc.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IMongoCollection<Role> _roles;
        private readonly IMongoCollection<User> _users;

        // Role & users login ada di database "common"
        public RoleController(ICommonDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _roles = database.GetCollection<Role>("role");
            _users = database.GetCollection<User>("users");
        }

        // GET api/pe/role
        [HttpGet]
        [Authorize("User Management")]
        public ActionResult<List<Role>> Get()
        {
            var roles = _roles
                .Find(Builders<Role>.Filter.Empty)
                .SortBy(role => role.name)
                .ToList();

            return Ok(roles);
        }

        // POST api/pe/role
        [HttpPost]
        [Authorize("User Management")]
        public ActionResult<Role> Create([FromBody] Role request)
        {
            if (string.IsNullOrWhiteSpace(request.name))
            {
                return BadRequest(new { message = "Role name wajib diisi" });
            }

            var name = request.name.Trim();
            if (_roles.CountDocuments(role => role.name == name) > 0)
            {
                return BadRequest(new { message = "Role name sudah dipakai" });
            }

            var newRole = new Role
            {
                name = name,
                description = request.description,
                permission = CleanPermission(request.permission)
            };

            _roles.InsertOne(newRole);
            return Ok(newRole);
        }

        // PUT api/pe/role/{id}
        // Nama role tidak boleh diubah, karena users.role menyimpan nama role
        [HttpPut("{id}")]
        [Authorize("User Management")]
        public ActionResult<Role> Update(string id, [FromBody] Role request)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest(new { message = "Invalid role id" });
            }

            var update = Builders<Role>.Update
                .Set(role => role.description, request.description)
                .Set(role => role.permission, CleanPermission(request.permission));

            var result = _roles.UpdateOne(role => role._id == id, update);
            if (result.MatchedCount == 0)
            {
                return NotFound(new { message = "Role not found" });
            }

            return Ok(_roles.Find(role => role._id == id).FirstOrDefault());
        }

        // DELETE api/pe/role/{id}
        [HttpDelete("{id}")]
        [Authorize("User Management")]
        public ActionResult Delete(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest(new { message = "Invalid role id" });
            }

            var existing = _roles.Find(role => role._id == id).FirstOrDefault();
            if (existing == null)
            {
                return NotFound(new { message = "Role not found" });
            }

            if (_users.CountDocuments(user => user.role == existing.name) > 0)
            {
                return BadRequest(new { message = "Role masih dipakai user, tidak bisa dihapus" });
            }

            _roles.DeleteOne(role => role._id == id);
            return Ok(new { deleted = true });
        }

        // Buang yang kosong & dobel
        private static string[] CleanPermission(string[] permission)
        {
            if (permission == null)
            {
                return new string[0];
            }

            return permission
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim())
                .Distinct()
                .ToArray();
        }
    }
}
