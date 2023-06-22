using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace PropertyPro.Controllers
{
    public class BaseController : ControllerBase
    {
        protected string? GetUserId(HttpContext httpContext)
        {
            var claimsIdentity = (ClaimsIdentity?)httpContext.User.Identity ?? null;
            var userIdClaim = claimsIdentity?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            return userIdClaim?.Value;
        }
    }
}
