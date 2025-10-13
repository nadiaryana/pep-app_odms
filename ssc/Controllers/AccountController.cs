using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using ssc.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System;
using static BCrypt.Net.BCrypt;

namespace ssc.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AccountController : ControllerBase
  {
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Role> _roles;
    //private readonly IMongoCollection<Company> _companies;

    public AccountController(ICommonDatabaseSettings settings)
    {
      var client = new MongoClient(settings.ConnectionString);
      var database = client.GetDatabase(settings.DatabaseName);

      _users = database.GetCollection<User>("users");
      _roles = database.GetCollection<Role>("role");
      //_companies = database.GetCollection<Company>("company");
    }

    [HttpPost("Login")]
    public ActionResult Login([FromBody] LoginDto login)
    {
      var username = login.username;
      var password = login.password;
      //string company_id = login.company_id;

      var user = _users.Find(x => x.username == username).FirstOrDefault();
      if (user != null && BCrypt.Net.BCrypt.Verify(password, user.password_hash))
      {
        var identity = new ClaimsIdentity("ssa", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

        Dictionary<string, string[]> role_permission = new Dictionary<string, string[]>();
        var lrole = _roles.Find(x => x.name == user.role).ToList();
        if (lrole.Count > 0)
        {
          foreach (var role in lrole)
          {
            if (role.permission != null)
            {
              role_permission[role.name] = role.permission;

              foreach (var permission in role.permission)
              {
                identity.AddClaim(new Claim(ClaimTypes.Role, permission, user.role, "PEP"));
              }
            }
          }
        }

        // ✅ Tambahkan izin manual PeProduction Add
        identity.AddClaim(new Claim(ClaimTypes.Role, "PeProduction Add", user.role, "PEP"));
        identity.AddClaim(new Claim("RolePermission", JsonConvert.SerializeObject(role_permission)));


        var key = Encoding.ASCII.GetBytes("YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv");
        var JWToken = new JwtSecurityToken(
            issuer: "https://localhost:44342/",
            audience: "https://localhost:44342/",
            claims: identity.Claims,
            notBefore: DateTime.Now,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        );

        var token = new JwtSecurityTokenHandler().WriteToken(JWToken);
        HttpContext.Session.SetString("JWToken", token);

        return Ok(new
        {
          user = new
          {
            Name = user.username,
            DisplayName = user.display_name,
            Email = user.email,
            Permission = identity.Claims.Where(x => x.Issuer == "PEP").Select(c => c.Value).ToArray(),
            token = token
          },
          timezone = TimeZoneInfo.Local
        });
      }

      return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Incorrect Username or Password" });

    }

    [HttpGet("Logout")]
    public ActionResult Logout()
    {
      try
      {
        //IAuthenticationManager authenticationManager = HttpContext.GetOwinContext().Authentication;
        //authenticationManager.SignOut(ApplicationCookie);
        HttpContext.Session.Clear();
        return Ok(new { result = true });
      }
      catch (Exception e)
      {
        return Ok(new { errMsg = e.Message });
      }
    }
  }

  public class LoginDto
  {
    public string username { get; set; }
    public string password { get; set; }
    //public string company_id { get; set; }
  }



}
