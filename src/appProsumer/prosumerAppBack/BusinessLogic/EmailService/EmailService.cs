using System;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace prosumerAppBack.Helper
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var apiKey = _configuration.GetValue<string>("ApiKey");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("noreply@prosumerapp.com", "Energy Solvix");
            var to = new EmailAddress(email);
            var textContent = message;
            var htmlContext = $"<div>{message}</div>";
            var mail = MailHelper.CreateSingleEmail(from, to, subject, textContent, htmlContext);
            await client.SendEmailAsync(mail);
        }
    }
}

