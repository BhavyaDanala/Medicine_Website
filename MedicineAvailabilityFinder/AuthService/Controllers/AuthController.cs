using AuthService.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class AuthController : ControllerBase

    {
        private readonly IMediator _mediator;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IMediator mediator, ILogger<AuthController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserCommand command)
        {
            try
            {
                var userId = await _mediator.Send(command);

                return Ok(new
                {
                    UserId = userId,
                    Message = "User Registered Successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserCommand command)
        {
            try
            {
                var token = await _mediator.Send(command);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult Profile()
        {
            return Ok("Authenticated User");
        }

        //Admin Endpoint
        [Authorize(Roles = "Admin")]
        [HttpGet("admin-dashboard")]
        public IActionResult AdminDashboard()
        {
            return Ok("Welcome Admin");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("pending-pharmacies")]
        public async Task<IActionResult> GetPendingPharmacies()
        {
            var query = new AuthService.Features.Auth.Queries.GetPendingPharmaciesQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("approve-pharmacy/{userId}")]
        public async Task<IActionResult> ApprovePharmacy(int userId)
        {
            var command = new AuthService.Features.Auth.Commands.UpdatePharmacyApprovalCommand
            {
                UserId = userId,
                ApprovalStatus = "Approved"
            };
            await _mediator.Send(command);
            return Ok(new { Message = "Pharmacy approved successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("reject-pharmacy/{userId}")]
        public async Task<IActionResult> RejectPharmacy(int userId)
        {
            var command = new AuthService.Features.Auth.Commands.UpdatePharmacyApprovalCommand
            {
                UserId = userId,
                ApprovalStatus = "Rejected"
            };
            await _mediator.Send(command);
            return Ok(new { Message = "Pharmacy rejected successfully" });
        }

        //Pharmacy Endpoint
        [Authorize(Roles = "Pharmacy")]
        [HttpGet("pharmacy-dashboard")]
        public IActionResult PharmacyDashboard()
        {
            return Ok("Welcome Pharmacy User");
        }

        //Customer Endpoint
        [Authorize(Roles = "Customer")]
        [HttpGet("customer-dashboard")]
        public IActionResult CustomerDashboard()
        {
            return Ok("Welcome Customer");
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(new { Message = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while sending OTP.");
                return BadRequest(new { message = "getting otp error: " + ex.Message });
            }
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpCommand command)
        {
            var isValid = await _mediator.Send(command);
            if (!isValid)
                return BadRequest(new { Message = "Invalid or expired OTP" });
            return Ok(new { Message = "OTP verified successfully" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordCommand command)
        {
            var resetLink = await _mediator.Send(command);

            return Ok(new
            {
                ResetLink = resetLink
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword( ResetPasswordCommand command)
        {
            var result = await _mediator.Send(command);

            return Ok(new
            {
                Message = result
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("admin-add-pharmacy")]
        public async Task<IActionResult> AdminAddPharmacy(AdminAddPharmacyCommand command)
        {
            try
            {
                var userId = await _mediator.Send(command);
                return Ok(new
                {
                    Message = "Pharmacy created successfully. Activation email has been sent to the pharmacy email address.",
                    UserId = userId
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("activate-pharmacy")]
        public async Task<IActionResult> ActivatePharmacy(ActivatePharmacyCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(new
                {
                    Message = "Account Activated Successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}