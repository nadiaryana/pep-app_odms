using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.DirectoryServices.AccountManagement;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using MongoDB.Driver;
using MongoDB.Bson;
using ssc.Models;

namespace ssc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IMongoDatabase database;
        private readonly IMongoCollection<Company> _companies;
        private readonly IMongoCollection<Role> _roles;

        public AccountController(ICommonDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            database = client.GetDatabase(settings.DatabaseName);

            _companies = database.GetCollection<Company>("company");
            _roles = database.GetCollection<Role>("role");
        }
        /*
        public ActionResult Login(string username, string password)
        {
            TokenProvider _tokenProvider = new TokenProvider();
            var userToken = _tokenProvider.LoginUser(username.Trim(), password.Trim());
            if (userToken != null)
            {
                //Save token in session object
                HttpContext.Session.SetString("JWToken", userToken);
                return Ok(new { access_token = userToken });
            }
            return Ok(new { });
        }
        */
        [HttpPost("Login")]
        public ActionResult Login(Login login)
        {
            string company_id = login.company_id;
            string username = login.username;
            string password = login.password;
            //IAuthenticationManager authenticationManager = HttpContext.GetOwinContext().Authentication;
            String errMsg = String.Empty;
            Company company = _companies.Find(c => c._id == company_id).First();

            if (company != null)
            {
                try
                {
                    PrincipalContext principalContext = new PrincipalContext(ContextType.Domain, company.domain);
                    bool isAuthenticated = false;
                    UserPrincipal userPrincipal = null;
                    isAuthenticated = principalContext.ValidateCredentials(username, password, ContextOptions.Negotiate);
                    if (isAuthenticated)
                    {
                        userPrincipal = UserPrincipal.FindByIdentity(principalContext, IdentityType.SamAccountName, username);
                        if (userPrincipal == null)
                        {
                            errMsg = "Incorrect Username or Password";
                        }
                        /*if (userPrincipal.IsAccountLockedOut())
                        {
                            errMsg = "Your account is locked.";
                        }

                        if (userPrincipal.Enabled.HasValue && userPrincipal.Enabled.Value == false)
                        {
                            errMsg = "Your account is disabled";
                        }*/

                        if (String.IsNullOrEmpty(errMsg))
                        {

                            var identity = new ClaimsIdentity("ssa", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
                            identity.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "Active Directory"));
                            identity.AddClaim(new Claim(ClaimTypes.Name, userPrincipal.SamAccountName));
                            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userPrincipal.SamAccountName));
                            if (!String.IsNullOrEmpty(userPrincipal.EmailAddress))
                            {
                                identity.AddClaim(new Claim(ClaimTypes.Email, userPrincipal.EmailAddress));
                            }
                            if (!String.IsNullOrEmpty(userPrincipal.EmployeeId))
                            {
                                identity.AddClaim(new Claim("EmployeeId", userPrincipal.EmployeeId));
                            }

                            //var AllRoleUser = GetGroupRoleUser(userPrincipal.SamAccountName, company.COMPANY_ID);

                            List<GroupPrincipal> AllRoleUser = new List<GroupPrincipal>();

                            PrincipalContext pc = new PrincipalContext(ContextType.Domain, company.domain);
                            UserPrincipal up = UserPrincipal.FindByIdentity(pc, IdentityType.SamAccountName, userPrincipal.SamAccountName);

                            //AllRoleUser.AddRange(GetGroupRole(up, company.domain, company.domain.container_role, company.domain.prefix_role));

                            foreach (Container c in company.container)
                            {
                                AllRoleUser.AddRange(GetGroupRole(up, company.domain, c.container_role, c.prefix_role));
                            }

                            int count = AllRoleUser.Count;

                            Dictionary<String, String[]> role_permission = new Dictionary<String, String[]>();
                            Dictionary<String, int[]> role_ba = new Dictionary<String, int[]>();

                            if (AllRoleUser.Count > 0)
                            {
                                foreach (var groupRole in AllRoleUser)
                                {
                                    if (groupRole.Name != null)
                                    {

                                        var lrole = _roles.Find(x => x.name == groupRole.Name).ToList();//.Select(r => new { ROLE_ID = r.ROLE_ID, PERMISSION = r.PERMISSION, BA = r.BA }).ToList();
                                        if (lrole.Count > 0)
                                        {
                                            foreach (var role in lrole)
                                            {
                                                if (role.permission != null)
                                                {
                                                    role_permission[role.name] = role.permission;

                                                    //int[] bas = role.BA.Select(a => a.BA_ID).ToArray();
                                                    //role_ba[role.ROLE_ID] = bas;

                                                    foreach (var permission in role.permission)
                                                    {
                                                        identity.AddClaim(new Claim(ClaimTypes.Role, permission, groupRole.Name, "PEP"));
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                                // ✅ Tambahkan izin manual PeProduction Add
                                identity.AddClaim(new Claim(ClaimTypes.Role, "PeProduction Add", user.role, "PEP"));

                                identity.AddClaim(new Claim("RolePermission", JsonConvert.SerializeObject(role_permission)));
                                //identity.AddClaim(new Claim("RoleBA", JsonConvert.SerializeObject(role_ba)));
                            }
                            else
                            {

                                var lrole = _roles.Find(x => x.name == "ssa-guest").ToList();//.Select(r => new { ROLE_ID = r.ROLE_ID, PERMISSION = r.PERMISSION, BA = r.BA }).ToList();
                                if (lrole.Count > 0)
                                {
                                    foreach (var role in lrole)
                                    {
                                        if (role.permission != null)
                                        {
                                            role_permission[role.name] = role.permission;

                                            //int[] bas = role.BA.Select(a => a.BA_ID).ToArray();
                                            //role_ba[role.ROLE_ID] = bas;

                                            foreach (var permission in role.permission)
                                            {
                                                identity.AddClaim(new Claim(ClaimTypes.Role, permission, "ssa-guest", "PEP"));
                                            }
                                        }
                                    }
                                }
                                // ✅ Tambahkan izin manual PeProduction Add
                                identity.AddClaim(new Claim(ClaimTypes.Role, "PeProduction Add", user.role, "PEP"));

                                identity.AddClaim(new Claim("RolePermission", JsonConvert.SerializeObject(role_permission)));
                                //identity.AddClaim(new Claim("RoleBA", JsonConvert.SerializeObject(role_ba)));
                            }

                            //authenticationManager.SignOut(ApplicationCookie);
                            //authenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = false }, identity);

                            var key = Encoding.ASCII.GetBytes
                          ("YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv");
                            //Generate Token for user 
                            var JWToken = new JwtSecurityToken(

                                  /* For Development*/
                                  issuer: "https://localhost:1911/",
                                  audience: "https://localhost:1911/",

                                /*
                               * For Production  */
                                //  issuer: "https://localhost:80/",
                                //   audience: "https://localhost:80/", // */
                                claims: identity.Claims,
                                notBefore: new DateTimeOffset(DateTime.Now).DateTime,
                                expires: new DateTimeOffset(DateTime.Now.AddDays(1)).DateTime,
                                //Using HS256 Algorithm to encrypt Token
                                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key),
                                                    SecurityAlgorithms.HmacSha256Signature)
                            );
                            var token = new JwtSecurityTokenHandler().WriteToken(JWToken);
                            HttpContext.Session.SetString("JWToken", token);

                            return Ok(new
                            {
                                user = new
                                {
                                    Name = userPrincipal.SamAccountName,
                                    DisplayName = userPrincipal.DisplayName,
                                    EmployeeId = userPrincipal.EmployeeId,
                                    EmployeeEmail = userPrincipal.EmailAddress,
                                    Permission = identity.Claims.Where(x => x.Issuer == "PEP").Select(c => c.Value).ToArray(),
                                    token = token,
                                    other = AllRoleUser.ToJson(),
                                },
                                timezone = TimeZoneInfo.Local
                            });

                        }
                    }
                    else
                    {
                        errMsg = "Incorrect Username or Password";
                    }
                }
                catch (Exception e)
                {
                    errMsg = e.Message;
                }

            }
            else
            {
                errMsg = "Company not found";
            }
            return Ok(new { errMsg = errMsg });
        }

        private static List<GroupPrincipal> GetGroupRole(UserPrincipal up, string domain_name, string container_role, string prefix_role)
        {
            List<GroupPrincipal> listGroupRole = new List<GroupPrincipal>();

            if (!String.IsNullOrEmpty(domain_name) && !String.IsNullOrEmpty(container_role))
            {
                PrincipalContext roleOU = new PrincipalContext(ContextType.Domain, domain_name, container_role);
                GroupPrincipal findAllGroups = new GroupPrincipal(roleOU, prefix_role + "*");
                var ps = new PrincipalSearcher(findAllGroups).FindAll();
                foreach (GroupPrincipal group in ps)
                {
                    if (up.IsMemberOf(group))
                    {
                        listGroupRole.Add(group);
                    }
                }
            }

            return listGroupRole;
        }

        [HttpGet("Company")]
        public ActionResult Company()
        {
            List<Company> companies = _companies.Find(new BsonDocument()).ToList();
            return Ok(new
            {
                items = companies
            });
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
        [Authorize("PeDaily Add")]
        [HttpGet("Role")]
        public ActionResult GetRole()
        {
            try
            {
                return new JsonResult(new
                {
                    roles = _roles.Find(new BsonDocument()).ToList()

                });
            }
            catch (Exception e)
            {
                return Ok(new { errMsg = e.Message });
            }

        }
        [Authorize("PeDaily Add")]
        [HttpPost("Role")]
        public ActionResult SetRole(Role role)
        {
            string name = role.name;
            string[] permissions = role.permission;
            try
            {
                _roles.InsertOne(role);

                return new JsonResult(new
                {
                    newrole = _roles.Find(newrole => newrole.name == name).ToList()

                });
            }
            catch (Exception e)
            {
                return BadRequest(new { errMsg = e.Message });
            }

        }
    }
}
