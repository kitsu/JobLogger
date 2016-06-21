using System;
using System.Linq;
using Xunit;
using JobLogger.Controllers;
using JobLogger.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace JobLoggerTests
{
    public class TestHomeController
    {
        [Fact]
        public async void IndexGetsLogs()
        {
            // Setup repo mock that returns an list of one ActivityLog
            var list = new List<BaseLog>();
            list.Add(new ActivityLog());
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.GetLogsAsync())
                .Returns(Task.FromResult<IEnumerable<BaseLog>>(list));

            var ctrl = new HomeController(repo.Object);
            var result = await ctrl.Index();
            Assert.IsType<ViewResult>(result);
            var view = (ViewResult)result;
            var model = Assert.IsAssignableFrom<ICollection<BaseLog>>
                (view.ViewData.Model);
            Assert.Equal(1, model.Count());
            Assert.IsType<ActivityLog>(model.First());
        }
    }
}
