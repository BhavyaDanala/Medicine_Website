using AuthService.Data;
using AuthService.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Features.Auth.Handlers
{
    public class UpdatePharmacyApprovalHandler : IRequestHandler<Commands.UpdatePharmacyApprovalCommand, bool>
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public UpdatePharmacyApprovalHandler(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<bool> Handle(Commands.UpdatePharmacyApprovalCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);
            if (user == null || user.Role != "Pharmacy")
            {
                throw new Exception("Invalid pharmacy user");
            }

            user.ApprovalStatus = request.ApprovalStatus;
            _context.Users.Update(user);
            await _context.SaveChangesAsync(cancellationToken);

            // Send notification
            await _emailService.SendPharmacyStatusEmail(user.Email, request.ApprovalStatus);

            return true;
        }
    }
}
