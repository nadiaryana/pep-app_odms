using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ssc.Areas.PE.Models;

namespace ssc.Areas.PE.Controllers
{
    [Route("api/pe/[controller]")]
    [ApiController]
    [Authorize]
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
        public ActionResult<List<UserManagement>> Get()
        {
            var users = _users
                .Find(Builders<UserManagement>.Filter.Empty)
                .SortByDescending(user => user.created_date)
                .ToList();

            return Ok(users);
        }

        [HttpPost]
        public ActionResult<UserManagement> Create([FromBody] CreateUserManagementRequest request)
        {
            var user = new UserManagement
            {
                _id = ObjectId.GenerateNewId().ToString(),
                name = request.name.Trim(),
                email = request.email.Trim(),
                department = request.department.Trim(),
                role = request.role.Trim(),
                access = request.access,
                status = request.status,
                join_date = request.join_date,
                created_date = DateTime.UtcNow
            };

            _users.InsertOne(user);
            return Ok(user);
        }
    }
}
