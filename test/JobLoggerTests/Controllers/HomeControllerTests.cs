using System;
using System.Linq;
using Xunit;
using JobLogger.Controllers;
using JobLogger.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace JobLoggerTests
{
    public class DummyRepo: ILogRepository
    {
        public async Task<IEnumerable<BaseLog>> JobLogsAsync()
        {
            var list = new List<BaseLog>();
            list.Add(new ActivityLog());
            return list;
        }
        public async Task AddAsync(BaseLog log)
        {
        }
    }
    public class TestHomeController
    {
        [Fact]
        public async void EnsureIndexGetsLogs()
        {
            var repo = new DummyRepo();
            var ctrl = new HomeController(repo);
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
