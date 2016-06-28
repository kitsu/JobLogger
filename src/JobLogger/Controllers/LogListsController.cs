using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobLogger.Models;
using System.Text;
using JobLogger.Services;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace JobLogger.Controllers
{
    [RequireHttps]
    public class LogListsController : Controller
    {
        private readonly ILogRepository _logRepository;
        private readonly IEmailSender _emailSender;

        public LogListsController(ILogRepository logRepository, IEmailSender emailSender)
        {
            _logRepository = logRepository;
            _emailSender = emailSender;
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

        // POST: /LogLists/EmailReport
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> EmailReport([FromBody] List<Guid> logs)
        {
            if (ModelState.IsValid)
            {
                var sb = new StringBuilder();
                sb.Append($"<h1>Job Logs</h1><hr />{logs.Count()} logs total<hr />");
                foreach (var id in logs)
                {
                    var log = await _logRepository.GetLogAsync(id);
                    if (log is ActivityLog) {
                        sb.Append(RenderActivity(log as ActivityLog));
                    } else
                    {
                        sb.Append(RenderContact(log as ContactLog));
                    }
                }
                await _emailSender.SendEmailAsync("", "Job Log Report", sb.ToString());
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        #region Helpers

        public string RenderActivity(ActivityLog log)
        {
            return $@"<h2>Activity log</h2>
                      <dl>
                          <dt>Date:</dt>
                          <dd>{log.LogDate.ToShortDateString()}</dd>
                          <dt>Location:</dt>
                          <dd>{log.Location}</dd>
                          <dt>Description:</dt>
                          <dd><pre>{log.Description}</pre></dd>
                      </dl><hr />";
        }

        public string RenderContact(ContactLog log)
        {
            return $@"<h2>Contact log</h2>
                      <dl>
                          <dt>Date:</dt>
                          <dd>{log.LogDate.ToShortDateString()}</dd>
                          <dt>Employer:</dt>
                          <dd>{log.Employer}</dd>
                          <dt>Contact:</dt>
                          <dd>{log.Contact}</dd>
                          <dt>Contacted type:</dt>
                          <dd>{typeof(ContactType).GetEnumName(log.ContactType)}</dd>
                          <dt>Means:</dt>
                          <dd>{typeof(ContactMeans).GetEnumName(log.ContactMeans)}</dd>
                          <dt>Address:</dt>
                          <dd>{log.Address}</dd>
                          <dt>City:</dt>
                          <dd>{log.City}</dd>
                          <dt>State:</dt>
                          <dd>{log.State}</dd>
                          <dt>Description:</dt>
                          <dd><pre>{log.Description}</pre></dd>
                      </dl><hr />";
        }

        #endregion Helpers
    }
}
