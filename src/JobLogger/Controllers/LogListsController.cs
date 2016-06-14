using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using JobLogger.Models;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace JobLogger.Controllers
{
    public class LogListsController : Controller
    {
        private readonly ILogRepository _logRepository;

        public LogListsController(ILogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        // GET: /LogLists/Week/{page}
        public async Task<IActionResult> Week(int Page)
        {
            // FIXME Create view model that extracts just dates for week
            var model = await _logRepository.JobLogsAsync();
            return View(model);
        }

        // GET: /LogLists/Add
        public IActionResult Add()
        {
            return View();
        }

        // POST: /LogLists/AddActivity
        [HttpPost]
        public async Task<JsonResult> AddActivity([FromBody] ActivityLog log)
        {
            if (ModelState.IsValid)
            {
                await _logRepository.AddAsync(log);
                return Json(new {good = true,
                                 data = Json(log)
                });
            }
            return Json(new { good = false });
        }

        // POST: /LogLists/AddContact
        [HttpPost]
        public async Task<JsonResult> AddContact([FromBody] ContactLog log)
        {
            if (ModelState.IsValid)
            {
                await _logRepository.AddAsync(log);
                return Json(new {success = true,
                                 data = Json(log)
                });
            }
            return Json(new { success = false });
        }

        // DELETE: /LogLists/delete
        [HttpDelete]
        public async Task<JsonResult> Delete(String target)
        {
            var logId = Guid.NewGuid();
            if (Guid.TryParse(target, out logId))
            {
                await _logRepository.DeleteAsync(logId);
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }
    }
}
