using AuthService.Data;
using AuthService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AddressesController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(idClaim, out int id)) return id;
            return 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            var userId = GetUserId();
            var addresses = await _context.UserAddresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.CreatedDate)
                .ToListAsync();

            return Ok(addresses);
        }

        [HttpPost]
        public async Task<IActionResult> AddAddress([FromBody] UserAddress address)
        {
            var userId = GetUserId();
            address.UserId = userId;
            address.CreatedDate = DateTime.UtcNow;

            var existingCount = await _context.UserAddresses.CountAsync(a => a.UserId == userId);
            if (existingCount == 0)
            {
                address.IsDefault = true;
            }

            var duplicate = await _context.UserAddresses.AnyAsync(a => a.UserId == userId &&
                a.StreetAddress.ToLower() == address.StreetAddress.ToLower() &&
                a.City.ToLower() == address.City.ToLower());

            if (duplicate)
            {
                return BadRequest("This address already exists in your profile.");
            }

            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(address);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] UserAddress address)
        {
            var userId = GetUserId();
            var existing = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == id && a.UserId == userId);
            if (existing == null) return NotFound();

            existing.AddressLabel = address.AddressLabel;
            existing.StreetAddress = address.StreetAddress;
            existing.City = address.City;
            existing.State = address.State;
            existing.PostalCode = address.PostalCode;
            existing.Country = address.Country;
            existing.Latitude = address.Latitude;
            existing.Longitude = address.Longitude;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var userId = GetUserId();
            var existing = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == id && a.UserId == userId);
            if (existing == null) return NotFound();

            _context.UserAddresses.Remove(existing);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}/default")]
        public async Task<IActionResult> SetDefaultAddress(int id)
        {
            var userId = GetUserId();
            var allAddresses = await _context.UserAddresses.Where(a => a.UserId == userId).ToListAsync();
            
            var target = allAddresses.FirstOrDefault(a => a.AddressId == id);
            if (target == null) return NotFound();

            foreach (var a in allAddresses)
            {
                a.IsDefault = false;
            }
            target.IsDefault = true;

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
