using AuthService.Data;
using AuthService.Features.Auth.Commands;
using AuthService.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;
using AuthService.Services;

namespace AuthService.Features.Auth.Handlers
{
    public class AdminAddPharmacyHandler : IRequestHandler<AdminAddPharmacyCommand, int>
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public AdminAddPharmacyHandler(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<int> Handle(AdminAddPharmacyCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (existingUser != null)
            {
                throw new Exception("A user with this email already exists.");
            }

            var activationToken = Guid.NewGuid().ToString("N");

            var user = new User
            {
                Name = request.PharmacyName ?? "Unknown",
                Email = request.Email ?? string.Empty,
                PasswordHash = "PENDING_ACTIVATION",
                Role = "Pharmacy",
                ApprovalStatus = "Approved",
                IsActive = true,
                IsActivated = false,
                ActivationToken = activationToken,
                ActivationTokenExpiry = DateTime.UtcNow.AddDays(7)
            };

            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                var innerMsg = dbEx.InnerException != null ? dbEx.InnerException.Message : dbEx.Message;
                throw new Exception($"Database insert failed: {innerMsg}");
            }

            try
            {
                var pharmacyServiceUrl = _configuration["PharmacyServiceUrl"];
                var client = _httpClientFactory.CreateClient();
                client.BaseAddress = new Uri(pharmacyServiceUrl);

                var pharmacyData = new
                {
                    PharmacyName = request.PharmacyName ?? "Unknown",
                    Address = request.Address ?? "",
                    PhoneNumber = request.PhoneNumber ?? "",
                    Email = request.Email ?? string.Empty,
                    Latitude = request.Latitude ?? 0.0,
                    Longitude = request.Longitude ?? 0.0,
                    UserId = user.UserId,
                    OpeningTime = request.OpeningTime ?? "",
                    ClosingTime = request.ClosingTime ?? ""
                };

                var json = JsonSerializer.Serialize(pharmacyData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync("/api/Pharmacies", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var pharmacyResponse = JsonSerializer.Deserialize<PharmacyResponse>(responseBody, options);

                    if (pharmacyResponse != null && pharmacyResponse.PharmacyId > 0)
                    {
                        user.PharmacyId = pharmacyResponse.PharmacyId;
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();

                        // Send Activation Email
                        if (!string.IsNullOrEmpty(request.Email))
                        {
                            await _emailService.SendPharmacyActivationEmail(request.Email, request.PharmacyName ?? "Unknown", activationToken);
                        }
                    }
                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    throw new Exception($"PharmacyService returned {response.StatusCode}: {errorBody}");
                }
            }
            catch (DbUpdateException ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                throw new Exception($"Database update failed: {innerMsg}");
            }
            catch (Exception ex)
            {
                if (user.UserId > 0)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                }
                throw new Exception($"Failed to create pharmacy record: {ex.Message}");
            }

            return user.UserId;
        }
    }
}
