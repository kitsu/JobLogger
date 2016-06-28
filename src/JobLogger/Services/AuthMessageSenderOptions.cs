using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobLogger.Services
{
    public class EmailSenderOptions
    {
        public string SendGridUser { get; set; }
        public string SendGridAppKey { get; set; }
    }
}
