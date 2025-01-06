using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using OvldUnobtrusiveValidationSample.Models;

namespace OvldUnobtrusiveValidationSample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View(new SampleInput());
        }

        [HttpPost]
        public IActionResult Index(SampleInput input)
        {
            if (!ModelState.IsValid) { 
                return View(input);
            }

            TempData["success"] = true;

            return RedirectToAction("Index");
        }


        public IActionResult CustomRules()
        {
            return View(new CustomRulesInput());
        }

        [HttpPost]
        public IActionResult CustomRules(CustomRulesInput input)
        {
            if (!ModelState.IsValid)
            {
                return View(input);
            }

            TempData["success"] = true;

            return RedirectToAction("CustomRules");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
