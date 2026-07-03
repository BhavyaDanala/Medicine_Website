using System.Net;
using System.Net.Mail;
using System.Text;
using PharmacyService.Models;
using PharmacyService.Data;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace PharmacyService.Services
{
    public class EmailNotificationService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ApplicationDbContext _context;

        public EmailNotificationService(
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>();
            _context = context;
        }

        public async Task SendLowStockEmail(
            string pharmacyEmail,
            string pharmacyName,
            string medicineName,
            int quantity,
            int pharmacyId,
            int medicineId)
        {
            try
            {
                Console.WriteLine($"[EmailNotification] Starting email send for Pharmacy: {pharmacyName}, Medicine: {medicineName}, Qty: {quantity}");
                Console.WriteLine($"[EmailNotification] Target Email: {pharmacyEmail}");

                // Check if notification was already sent within 24 hours
                var recentNotification = await _context.NotificationLogs
                    .Where(n => n.PharmacyId == pharmacyId
                        && n.MedicineId == medicineId
                        && n.NotificationType == "LowStock"
                        && n.SentAt >= DateTime.UtcNow.AddHours(-24))
                    .FirstOrDefaultAsync();

                if (recentNotification != null)
                {
                    Console.WriteLine($"[EmailNotification] Email already sent within 24 hours for PharmacyId: {pharmacyId}, MedicineId: {medicineId}. Skipping.");
                    return;
                }

                var subject = $"⚠️ Low Stock Alert - {pharmacyName}";
                var body = BuildLowStockEmailBody(pharmacyName, medicineName, quantity);

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                message.To.Add(new MailboxAddress("", pharmacyEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder { HtmlBody = body };
                message.Body = bodyBuilder.ToMessageBody();

                Console.WriteLine($"[EmailNotification] Connecting to SMTP: {_emailSettings.SmtpServer}:{_emailSettings.Port} with MailKit");

                using var client = new MailKit.Net.Smtp.SmtpClient();
                if (_emailSettings.EnableSsl)
                {
                    await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                }
                else
                {
                    await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.None);
                }

                await client.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.SenderPassword);

                Console.WriteLine($"[EmailNotification] Sending email...");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                Console.WriteLine($"[EmailNotification] Email sent successfully!");

                // Log successful notification
                await LogNotification(pharmacyId, medicineId, pharmacyName, pharmacyEmail,
                    medicineName, quantity, "LowStock", true, string.Empty);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailNotification] ERROR sending email: {ex.Message}");
                Console.WriteLine($"[EmailNotification] Stack trace: {ex.StackTrace}");
                // Log failed notification
                await LogNotification(pharmacyId, medicineId, pharmacyName, pharmacyEmail,
                    medicineName, quantity, "LowStock", false, ex.Message);
                throw;
            }
        }

        private string BuildLowStockEmailBody(string pharmacyName, string medicineName, int quantity)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #f5af19 0%, #f12711 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }");
            sb.AppendLine("        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .alert-box { background: #fff3cd; border-left: 5px solid #f5af19; padding: 20px; margin: 20px 0; border-radius: 5px; }");
            sb.AppendLine("        .medicine-name { font-size: 24px; font-weight: bold; color: #f12711; }");
            sb.AppendLine("        .stock-level { font-size: 48px; font-weight: bold; color: #f12711; text-align: center; margin: 20px 0; }");
            sb.AppendLine("        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>⚠️ Low Stock Alert</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine("            <p>Hello <strong>" + pharmacyName + "</strong>,</p>");
            sb.AppendLine("            <div class='alert-box'>");
            sb.AppendLine("                <p>The following medicine is running low and may soon go out of stock:</p>");
            sb.AppendLine("                <p class='medicine-name'>" + medicineName + "</p>");
            sb.AppendLine("                <p style='text-align: center;'>Current Stock Level:</p>");
            sb.AppendLine("                <p class='stock-level'>" + quantity + "</p>");
            sb.AppendLine("            </div>");
            sb.AppendLine("            <p><strong>Action Required:</strong> Please restock this medicine at the earliest to avoid stockouts.</p>");
            sb.AppendLine("            <p>This alert was generated automatically by the MediFind Inventory Management System.</p>");
            sb.AppendLine("            <div class='footer'>");
            sb.AppendLine("                <p>Best regards,</p>");
            sb.AppendLine("                <p><strong>MediFind Notification Service</strong></p>");
            sb.AppendLine("                <p style='font-size: 11px; color: #999;'>This is an automated message. Please do not reply to this email.</p>");
            sb.AppendLine("            </div>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }

        private async Task LogNotification(
            int pharmacyId,
            int medicineId,
            string pharmacyName,
            string pharmacyEmail,
            string medicineName,
            int quantity,
            string notificationType,
            bool emailSent,
            string emailError)
        {
            var log = new NotificationLog
            {
                PharmacyId = pharmacyId,
                MedicineId = medicineId,
                PharmacyName = pharmacyName,
                PharmacyEmail = pharmacyEmail ?? string.Empty,
                MedicineName = medicineName,
                Quantity = quantity,
                SentAt = DateTime.UtcNow,
                NotificationType = notificationType,
                EmailSent = emailSent,
                EmailError = emailError ?? string.Empty
            };

            _context.NotificationLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        public int GetLowStockThreshold()
        {
            return _emailSettings?.LowStockThreshold ?? 10;
        }
    }
}
