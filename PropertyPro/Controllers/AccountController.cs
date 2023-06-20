﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using PropertyPro.Infrastructure.Dtos.Account;
using PropertyPro.Infrastructure.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PropertyPro.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole<Guid>> roleManager;
        private readonly IConfiguration configuration;

        public AccountController(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager, IConfiguration _configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.configuration = _configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user != null && await userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                var token = await CreateToken(user);

                return Ok(new
                {
                    user = new
                    {
                        FirstName = user.FirstName,
                        MiddleName = user.MiddleName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Gender = user.Gender,
                        ProfilePicture = user.ProfilePicture,
                        PhoneNumber = user.PhoneNumber,
                        Age = user.Age
                    },
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expires = token.ValidTo
                }); ;
            }

            return Unauthorized(new
            {
                Message = "User with such email doesn't exist"
            });
        }

        [HttpPost]
        [Route("register/landlord")]
        public async Task<IActionResult> RegisterLandlord(RegisterDto registerDto)
        {
            var userExists = await userManager.FindByEmailAsync(registerDto.Email);

            if (userExists != null)
                return Unauthorized(new
                {
                    Status="Error",
                    Message = "User already exists"
                });

            var user = new User()
            {
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                MiddleName = registerDto.MiddleName,
                Gender = registerDto.Gender,
                Age = registerDto.Age,
                UserName = registerDto.Username,
                PhoneNumber = registerDto.PhoneNumber
            };

            ///Or this way with the user manager
            await userManager.UpdateSecurityStampAsync(user);

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User creation failed! Please check user details and try again.",Errors=result.Errors });

            if (!await roleManager.RoleExistsAsync("Landlord"))
            {
                var landlordRole = new IdentityRole<Guid>("Landlord");
                await roleManager.CreateAsync(landlordRole);

                await userManager.AddToRolesAsync(user, new List<string>() { "Landlord" });
            }

            return Ok(new { Status = "Success", Message = "User created successfully!" });
        }


        [HttpPost]
        [Route("register/tenant")]
        public async Task<IActionResult> RegisterTenant(RegisterDto registerDto)
        {
            var userExists = await userManager.FindByEmailAsync(registerDto.Email);

            if (userExists != null)
                return Unauthorized(new
                {
                    Status = "Error",
                    Message = "User already exists"
                });

            var user = new User()
            {
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                MiddleName = registerDto.MiddleName,
                Gender = registerDto.Gender,
                Age = registerDto.Age,
                UserName = registerDto.Username,
                PhoneNumber = registerDto.PhoneNumber
            };

            ///Or this way with the user manager
            await userManager.UpdateSecurityStampAsync(user);

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Status = "Error", Message = "User creation failed! Please check user details and try again." });

            if (!await roleManager.RoleExistsAsync("Tenant"))
            {
                var tenantRole = new IdentityRole<Guid>("Tenant");
                await roleManager.CreateAsync(tenantRole);

                await userManager.AddToRolesAsync(user, new List<string>() { "Tenant" });
            }

            return Ok(new { Status = "Success", Message = "User created successfully!" });
        }

        private async Task<JwtSecurityToken> CreateToken(User user)
        {
            var userRoles = await userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
    }
}
