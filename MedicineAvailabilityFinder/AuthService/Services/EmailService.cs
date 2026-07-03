using MailKit.Net.Smtp;
using MailKit.Security;
using MailKit;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendOtpEmail(string toEmail, string otp, string purpose)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

            _logger.LogInformation($"[EmailService] Loaded SMTP Config: Server={smtpServer}, Port={port}, Sender={senderEmail}, SSL={enableSsl}");

            var subject = purpose == "Register"
                ? "MediFind - Email Verification OTP"
                : "MediFind - Password Reset OTP";

            var body = BuildOtpEmailBody(otp, purpose);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                _logger.LogInformation($"[INFO] Email Created");

                var protocolLogFile = Path.Combine(Directory.GetCurrentDirectory(), "smtp_protocol.log");
                using var client = new SmtpClient(new ProtocolLogger(protocolLogFile));
                
                // Connect
                if (enableSsl)
                {
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
                }
                else
                {
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.None);
                }

                _logger.LogInformation($"[INFO] SMTP Connected");
                // Authenticate
                await client.AuthenticateAsync(senderEmail, senderPassword.Replace(" ", ""));

                _logger.LogInformation($"[INFO] SMTP Authenticated");
                // Send
                await client.SendAsync(message);
                
                // Disconnect
                await client.DisconnectAsync(true);

                _logger.LogInformation($"[INFO] Email Sent");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[INFO] Email Failed");
                _logger.LogError(ex, $"[INFO] Actual SMTP Error: {ex.Message}");
                throw;
            }
        }

        private string BuildOtpEmailBody(string otp, string purpose)
        {
            var headerColor = purpose == "Register" ? "#667eea" : "#f5af19";
            var title = purpose == "Register" ? "Email Verification" : "Password Reset";
            var message = purpose == "Register"
                ? "Thank you for registering with MediFind. Use the OTP below to verify your email address."
                : "We received a request to reset your password. Use the OTP below to proceed.";

            return $@"<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }}
    .container {{ max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
    .header {{ background: {headerColor}; padding: 30px; text-align: center; color: white; }}
    .header h1 {{ margin: 0; font-size: 24px; }}
    .body {{ padding: 30px; text-align: center; }}
    .otp-box {{ background: #f4f6f9; border: 2px dashed {headerColor}; border-radius: 12px; padding: 20px; margin: 20px 0; }}
    .otp-code {{ font-size: 42px; font-weight: bold; color: {headerColor}; letter-spacing: 8px; }}
    .expiry {{ color: #888; font-size: 13px; margin-top: 10px; }}
    .footer {{ background: #f4f6f9; padding: 16px; text-align: center; color: #aaa; font-size: 12px; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'><h1>🏥 MediFind - {title}</h1></div>
    <div class='body'>
      <p>{message}</p>
      <div class='otp-box'>
        <div class='otp-code'>{otp}</div>
        <div class='expiry'>⏱ This OTP expires in 10 minutes</div>
      </div>
      <p style='color:#666;font-size:13px;'>Do not share this OTP with anyone.</p>
    </div>
    <div class='footer'>MediFind &copy; 2026 · Automated Message · Do not reply</div>
  </div>
</body>
</html>";
        }

        public async Task SendPharmacyStatusEmail(string toEmail, string status)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

            var subject = status == "Approved"
                ? "Pharmacy Registration Approved"
                : "Pharmacy Registration Rejected";

            var messageBody = status == "Approved"
                ? "Hello,<br><br>Your pharmacy registration has been approved by the administrator.<br><br>You may now login and access your pharmacy dashboard.<br><br>Thank you,<br>MediFind Team"
                : "Hello,<br><br>Your pharmacy registration request was rejected by the administrator.<br><br>Please contact us for further details.<br><br>Thank you,<br>MediFind Team";

            var body = $@"<html><body style='font-family: Arial, sans-serif;'>{messageBody}</body></html>";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using var client = new SmtpClient();
                if (enableSsl)
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
                else
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.None);
                    
                await client.AuthenticateAsync(senderEmail, senderPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailService] Error sending pharmacy status email.");
            }
        }

        public async Task SendAdminNotificationForNewPharmacy(string adminEmail, string pharmacyName, string pharmacyEmail)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

            var subject = "New Pharmacy Registration Pending Approval";

            var messageBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2>New Pharmacy Registration</h2>
                    <p>Hello Admin,</p>
                    <p>A new pharmacy has registered and is awaiting your approval.</p>
                    <ul>
                        <li><strong>Pharmacy Name:</strong> {pharmacyName}</li>
                        <li><strong>Email:</strong> {pharmacyEmail}</li>
                    </ul>
                    <p>Please <a href='http://localhost:3000/'>log in</a> to the admin dashboard to review and approve or reject this request.</p>
                    <br>
                    <p>Thank you,<br>MediFind System</p>
                </body>
                </html>";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", adminEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = messageBody };
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using var client = new SmtpClient();
                if (enableSsl)
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
                else
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.None);
                    
                await client.AuthenticateAsync(senderEmail, senderPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailService] Error sending admin notification email.");
            }
        }

        public async Task SendPharmacyActivationEmail(string toEmail, string pharmacyName, string token)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

            var subject = "Welcome to MediFind - Complete Your Pharmacy Account Setup";

            var messageBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <p>Hello,</p>
                    <p>A pharmacy account has been created for you in MediFind.</p>
                    <p>Pharmacy Name:<br><strong>{pharmacyName}</strong></p>
                    <p>To access your pharmacy dashboard, please create your password by clicking the button below.</p>
                    <p><a href='http://localhost:3000/create-password?token={token}' style='display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;'>Create Password</a></p>
                    <br>
                    <p>Thank you,<br>MediFind Team</p>
                </body>
                </html>";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = messageBody };
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using var client = new SmtpClient();
                if (enableSsl)
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
                else
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.None);
                    
                await client.AuthenticateAsync(senderEmail, senderPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailService] Error sending pharmacy activation email.");
            }
        }

        public async Task SendPharmacyActivationSuccessEmail(string toEmail, string pharmacyName)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderPassword = _configuration["EmailSettings:SenderPassword"];
            var enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"]);

            var subject = "Your MediFind Pharmacy Account Is Ready";

            var messageBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <p>Hello,</p>
                    <p>Your pharmacy account has been activated successfully.</p>
                    <p>Pharmacy:<br><strong>{pharmacyName}</strong></p>
                    <p>You can now login and access your dashboard.</p>
                    <p><a href='http://localhost:3000/login' style='display:inline-block;padding:10px 20px;background-color:#2196F3;color:white;text-decoration:none;border-radius:5px;'>Login To MediFind</a></p>
                    <br>
                    <p>Thank you,<br>MediFind Team</p>
                </body>
                </html>";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = messageBody };
            message.Body = bodyBuilder.ToMessageBody();

            try
            {
                using var client = new SmtpClient();
                if (enableSsl)
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
                else
                    await client.ConnectAsync(smtpServer, port, SecureSocketOptions.None);
                    
                await client.AuthenticateAsync(senderEmail, senderPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[EmailService] Error sending pharmacy activation success email.");
            }
        }
    }
}
