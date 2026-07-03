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
    public class PharmacyResponse
    {
        public string Message { get; set; }
        public int PharmacyId { get; set; }
    }

    public class RegisterUserHandler :
        IRequestHandler<RegisterUserCommand, int>
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public RegisterUserHandler(ApplicationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<int> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var existingUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == request.Email);

            if (existingUser != null)
            {
                throw new Exception("User already exists");
            }

            if (!IsValidPassword(request.Password))
            {
                throw new Exception("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
            }

            string displayName = request.Name;
            if (request.Role == "Admin") displayName = "Admin";
            else if (request.Role == "Pharmacy" && !string.IsNullOrEmpty(request.PharmacyName)) displayName = request.PharmacyName;

            var user = new User
            {
                Name = displayName ?? "User",
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role,
                ApprovalStatus = request.Role == "Pharmacy" ? "Pending" : "Approved"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // If registering as Pharmacy, create pharmacy record in PharmacyService
            if (request.Role == "Pharmacy" && !string.IsNullOrEmpty(request.PharmacyName))
            {
                try
                {
                    var pharmacyServiceUrl = _configuration["PharmacyServiceUrl"];
                    var client = _httpClientFactory.CreateClient();
                    client.BaseAddress = new Uri(pharmacyServiceUrl);

                    var pharmacyData = new
                    {
                        PharmacyName = request.PharmacyName,
                        Address = request.Address ?? "",
                        PhoneNumber = request.PhoneNumber ?? "",
                        Email = request.Email,
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
                        Console.WriteLine($"[RegisterUser] Pharmacy response: {responseBody}");

                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var pharmacyResponse = JsonSerializer.Deserialize<PharmacyResponse>(responseBody, options);

                        if (pharmacyResponse != null && pharmacyResponse.PharmacyId > 0)
                        {
                            user.PharmacyId = pharmacyResponse.PharmacyId;
                            _context.Users.Update(user);
                            await _context.SaveChangesAsync();
                            Console.WriteLine($"[RegisterUser] Successfully updated User {user.UserId} with PharmacyId {user.PharmacyId}");

                            try 
                            {
                                var adminUser = await _context.Users.FirstOrDefaultAsync(u => u.Role == "Admin");
                                if (adminUser != null)
                                {
                                    await _emailService.SendAdminNotificationForNewPharmacy(adminUser.Email, request.PharmacyName, request.Email);
                                }
                            } 
                            catch (Exception emailEx) 
                            {
                                Console.WriteLine($"[RegisterUser] Failed to send admin notification email: {emailEx.Message}");
                            }
                        }
                        else 
                        {
                            Console.WriteLine("[RegisterUser] Failed to extract PharmacyId from response.");
                        }
                    }
                    else
                    {
                        var errorBody = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"[RegisterUser] PharmacyService returned {response.StatusCode}: {errorBody}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[RegisterUser] Failed to create pharmacy record: {ex.Message}");
                }
            }

            return user.UserId;
        }

        private bool IsValidPassword(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8) return false;
            if (!password.Any(char.IsUpper)) return false;
            if (!password.Any(char.IsLower)) return false;
            if (!password.Any(char.IsDigit)) return false;
            if (!password.Any(ch => !char.IsLetterOrDigit(ch))) return false;
            return true;
        }
    }
}