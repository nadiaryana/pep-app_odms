using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<UserManagement> _users;

        public UserController(IPEDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _users = database.GetCollection<UserManagement>("user_management");
        }

        [HttpGet]
        [Authorize("User Management")]
        public ActionResult<List<UserManagement>> Get()
        {
            var users = _users
                .Find(Builders<UserManagement>.Filter.Empty)
                .SortByDescending(user => user.created_date)
                .ToList();

            return Ok(users);
        }

        [HttpPost]
        [Authorize("User Management")]
        public ActionResult<UserManagement> Create([FromBody] CreateUserManagementRequest request)
        {
            var user = new UserManagement
            {
                _id = ObjectId.GenerateNewId().ToString(),
                name = request.name.Trim(),
                email = request.email.Trim(),
                department = request.department.Trim(),
                role = request.role.Trim(),
                access = NormalizeAccess(request.access),
                status = request.status,
                join_date = request.join_date,
                created_date = DateTime.UtcNow
            };

            _users.InsertOne(user);
            return Ok(user);
        }

        [HttpPut("{id}")]
        [Authorize("User Management")]
        public ActionResult<UserManagement> Update(string id, [FromBody] CreateUserManagementRequest request)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest(new { message = "Invalid user id" });
            }

            var userObjectId = objectId.ToString();
            var filter = Builders<UserManagement>.Filter.Eq(user => user._id, userObjectId);
            var existing = _users.Find(filter).FirstOrDefault();
            if (existing == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var update = Builders<UserManagement>.Update
                .Set(user => user.name, request.name.Trim())
                .Set(user => user.email, request.email.Trim())
                .Set(user => user.department, request.department.Trim())
                .Set(user => user.role, request.role.Trim())
                .Set(user => user.access, NormalizeAccess(request.access))
                .Set(user => user.status, request.status)
                .Set(user => user.join_date, request.join_date)
                .Set(user => user.updated_by, User?.Identity?.Name)
                .Set(user => user.updated_date, DateTime.UtcNow);

            _users.UpdateOne(filter, update);

            return Ok(_users.Find(filter).FirstOrDefault());
        }

        [HttpDelete("{id}")]
        [Authorize("User Management")]
        public ActionResult Delete(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest(new { message = "Invalid user id" });
            }

            var result = _users.DeleteOne(user => user._id == objectId.ToString());
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { deleted_count = result.DeletedCount });
        }

        private static string[] NormalizeAccess(string[] access)
        {
            if (access == null)
            {
                return new string[0];
            }

            return access
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
        }
    }
}
