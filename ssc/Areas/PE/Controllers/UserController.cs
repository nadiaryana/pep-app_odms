using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ssc.Areas.PE.Models;
using ssc.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<UserManagement> _users;

        // Pakai collection "users" di database common (sama dengan login)
        public UserController(ICommonDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _users = database.GetCollection<UserManagement>("users");
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
            if (string.IsNullOrWhiteSpace(request.password))
            {
                return BadRequest(new { message = "Password wajib diisi" });
            }

            var username = request.username.Trim();
            if (_users.CountDocuments(user => user.username == username) > 0)
            {
                return BadRequest(new { message = "Username sudah dipakai" });
            }

            var newUser = new UserManagement
            {
                _id = ObjectId.GenerateNewId().ToString(),
                username = username,
                name = request.name.Trim(),
                email = request.email.Trim(),
                password_hash = BCrypt.Net.BCrypt.HashPassword(request.password),
                department = request.department.Trim(),
                role = request.role.Trim(),
                status = request.status,
                join_date = request.join_date,
                created_by = User?.Identity?.Name,
                created_date = DateTime.UtcNow
            };

            _users.InsertOne(newUser);
            return Ok(newUser);
        }

        [HttpPut("{id}")]
        [Authorize("User Management")]
        public ActionResult<UserManagement> Update(string id, [FromBody] CreateUserManagementRequest request)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest(new { message = "Invalid user id" });
            }

            var filter = Builders<UserManagement>.Filter.Eq(user => user._id, id);
            if (_users.CountDocuments(filter) == 0)
            {
                return NotFound(new { message = "User not found" });
            }

            var username = request.username.Trim();
            if (_users.CountDocuments(user => user.username == username && user._id != id) > 0)
            {
                return BadRequest(new { message = "Username sudah dipakai" });
            }

            var update = Builders<UserManagement>.Update
                .Set(user => user.username, username)
                .Set(user => user.name, request.name.Trim())
                .Set(user => user.email, request.email.Trim())
                .Set(user => user.department, request.department.Trim())
                .Set(user => user.role, request.role.Trim())
                .Set(user => user.status, request.status)
                .Set(user => user.join_date, request.join_date)
                .Set(user => user.updated_by, User?.Identity?.Name)
                .Set(user => user.updated_date, DateTime.UtcNow);

            // Password hanya diganti kalau diisi
            if (!string.IsNullOrWhiteSpace(request.password))
            {
                update = update.Set(user => user.password_hash, BCrypt.Net.BCrypt.HashPassword(request.password));
            }

            _users.UpdateOne(filter, update);

            return Ok(_users.Find(filter).FirstOrDefault());
        }

        [HttpDelete("{id}")]
        [Authorize("User Management")]
        public ActionResult Delete(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest(new { message = "Invalid user id" });
            }

            var result = _users.DeleteOne(user => user._id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { deleted_count = result.DeletedCount });
        }
    }
}
