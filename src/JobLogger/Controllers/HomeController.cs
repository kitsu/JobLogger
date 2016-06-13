using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using JobLogger.Models;

namespace JobLogger.Controllers
{
    public class HomeController : Controller
    {

        private readonly ILogRepository _logRepository;

        public HomeController(ILogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _logRepository.JobLogsAsync());
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
