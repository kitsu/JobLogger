using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace JobLogger.Services
{
    public class AuthMessageSender : IEmailSender
    {
        public AuthMessageSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; }  // set only via Secret Manager

        public void SendEmail(string recipient, string subject, string message)
        {
            string apiKey = Options.SendGridAppKey;
            var sg = new SendGridAPIClient(apiKey);

            var from = new Email("donotreply@joblogger.com");
            var to = new Email(recipient);
            var text = new Content("text/plain", message);
            var html = new Content("text/html", $@"<!DOCTYPE HTML>
            <html>
            <head>
            <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
            </head>
            <body>{message}</body></html>");
            var mail = new Mail(from, subject, to, text);
            mail.AddContent(html);

            // Escape quotes per https://github.com/sendgrid/sendgrid-csharp/issues/245
            var body = mail.Get().Replace("'", "\\\"");
            dynamic response = sg.client.mail.send.post(requestBody: body);
            var code = response.StatusCode;
            var res = response.Body.ReadAsStringAsync().Result;
            var head = response.Headers.ToString();
        }
    }
}
