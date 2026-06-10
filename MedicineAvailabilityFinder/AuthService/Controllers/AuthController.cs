using AuthService.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class AuthController : ControllerBase

    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserCommand command)
        {
            var userId =
                await _mediator.Send(command);

            return Ok(new
            {
                UserId = userId,
                Message =
                "User Registered Successfully"
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserCommand command)
        {
            var token =
                await _mediator.Send(command);

            return Ok(new
            {
                Token = token
            });
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

    }
}