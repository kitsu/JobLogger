﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobLogger.Models;
using System.Net;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace JobLogger.Controllers
{
    [RequireHttps]
    public class LogListsController : Controller
    {
        private readonly ILogRepository _logRepository;

        public LogListsController(ILogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        // GET: /LogLists/
        public async Task<JsonResult> Index()
        {
            var logs = await _logRepository.GetLogsAsync();
            return Json(new { success = true,
                              data = logs });
        }

        // GET: /LogLists/Edit
        public async Task<JsonResult> Edit(string target)
        {
            var logId = Guid.NewGuid();
            if (Guid.TryParse(target, out logId))
            {
                var log = await _logRepository.GetLogAsync(logId);
                return Json(new { success = true,
                                  data = log });
            }
            return Json(new { success = false });
        }

        // POST: /LogLists/EditActivity/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> EditActivity(Guid Id, [FromBody] ActivityLog log)
        {
            if (ModelState.IsValid)
            {
                log.Id = Id;
                var success = await _logRepository.UpdateAsync(log);
                if (success)
                {
                    return Json(new { success = true });
                }
            }
            return Json(new { success = false });
        }

        // POST: /LogLists/EditContact/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> EditContact(Guid Id, [FromBody] ContactLog log)
        {
            if (ModelState.IsValid)
            {
                log.Id = Id;
                var success = await _logRepository.UpdateAsync(log);
                if (success)
                {
                    return Json(new { success = true });
                }
            }
            return Json(new { success = false });
        }

        // POST: /LogLists/AddActivity
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddActivity([FromBody] ActivityLog log)
        {
            if (ModelState.IsValid)
            {
                var added = await _logRepository.AddAsync(log);
                if (added)
                {
                    return Json(new { success = true, data = log });
                }
            }
            return Json(new { success = false });
        }

        // POST: /LogLists/AddContact
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddContact([FromBody] ContactLog log)
        {
            if (ModelState.IsValid)
            {
                var added = await _logRepository.AddAsync(log);
                if (added)
                {
                    return Json(new { success = true, data = log });
                }
            }
            return Json(new { success = false });
        }

        // DELETE: /LogLists/delete
        [HttpDelete]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> Delete(string target)
        {
            var logId = Guid.NewGuid();
            if (Guid.TryParse(target, out logId))
            {
                var deleted = await _logRepository.DeleteAsync(logId);
                if (deleted)
                {
                    return Json(new { success = true });
                }
            }
            return Json(new { success = false });
        }
    }
}
