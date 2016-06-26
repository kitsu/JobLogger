using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using JobLogger.Models;

namespace JobLogger.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {

        private readonly ILogRepository _logRepository;

        public HomeController(ILogRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
