using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using JobLogger.Models;

namespace JobLogger.Controllers
{
    public class SharingController : Controller
    {

        private readonly ILogRepository _logRepository;
        private readonly IUserRepository _userRepository;

        public SharingController(ILogRepository logRepository,
                                 IUserRepository userRepository)
        {
            _logRepository = logRepository;
            _userRepository = userRepository;
        }

        // GET: /Sharing/{user}
        public IActionResult Index(string userId, string logs)
        {
            if (ModelState.IsValid)
            {
                // Get user so name can be displayed
                var userName = _userRepository.GetUserName(userId);
                if (!string.IsNullOrEmpty(userName))
                {
                    ViewData["userName"] = userName;
                    if (!string.IsNullOrWhiteSpace(logs))
                    {
                        var model = new List<BaseLog>();
                        BaseLog log;
                        Guid logGuid;
                        foreach (var logId in logs.Split(','))
                        {
                            logGuid = Guid.Empty;
                            Guid.TryParse(logId, out logGuid);
                            if (logGuid != Guid.Empty)
                            {
                                log = _logRepository.GetLogAsync(userId, logGuid);
                                if (log != null)
                                {
                                    model.Add(log);
                                }
                            }
                        }
                        return View(model);
                    }
                }
            }
            return View();
        }

    }
}