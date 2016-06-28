using System;
using System.Linq;
using Xunit;
using JobLogger.Controllers;
using JobLogger.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using JobLogger.Services;
using System.Text.RegularExpressions;

namespace JobLoggerTests
{
    public class TestLogListController
    {
        public static string goodId = "12345678-9abc-4def-a123-456789abcdf0";
        public static Guid goodGuid = Guid.Parse(goodId);

        [Fact]
        public async void IndexProvidesLogList()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that returns an list of one ActivityLog
            var list = new List<BaseLog>();
            list.Add(new ActivityLog());
            list.Add(new ActivityLog());
            list.Add(new ActivityLog());
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.GetLogsAsync())
                .Returns(Task.FromResult<IEnumerable<BaseLog>>(list));

            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.Index();
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);
            var data = (List<BaseLog>)model.data;
            Assert.Equal(data.Count(), 3);
        }

        [Fact]
        public async void EditGetHandlesIds()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that returns an list of one ActivityLog
            var log = new ActivityLog();
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.GetLogAsync(goodGuid))
                .Returns(Task.FromResult<BaseLog>(log));

            // Good guid test
            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.Edit(goodId);
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);
            Assert.Equal(model.data, log);

            // Bad guid test (this never hits the repo)
            result = await ctrl.Edit("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }

        [Fact]
        public async void EditActivityPostSucceedsOnUpdate()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that accepts one Id but not another
            var good = new ActivityLog();
            good.Id = new Guid();
            var bad = new ActivityLog();
            bad.Id = new Guid();
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.UpdateAsync(good)).Returns(Task.FromResult(true));
            repo.Setup(r => r.UpdateAsync(bad)).Returns(Task.FromResult(false));

            // Good guid test
            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.EditActivity(good.Id, good);
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);

            // Bad guid test
            result = await ctrl.EditActivity(bad.Id, bad);
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);

            // No guid test
            result = await ctrl.EditActivity(Guid.Empty, bad);
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }

        [Fact]
        public async void EditContactPostSucceedsOnUpdate()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that accepts one Id but not another
            var good = new ContactLog();
            good.Id = new Guid();
            var bad = new ContactLog();
            bad.Id = new Guid();
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.UpdateAsync(good)).Returns(Task.FromResult(true));
            repo.Setup(r => r.UpdateAsync(bad)).Returns(Task.FromResult(false));

            // Good guid test
            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.EditContact(good.Id, good);
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);

            // Bad guid test
            result = await ctrl.EditContact(bad.Id, bad);
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);

            // No guid test
            result = await ctrl.EditContact(Guid.Empty, bad);
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }

        [Fact]
        public async void AddActivityPostSucceedsOnAdd()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that accepts one Id but not another
            var good = new ActivityLog();
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.AddAsync(good)).Returns(Task.FromResult(true));
            repo.Setup(r => r.AddAsync(null)).Returns(Task.FromResult(false));

            // Good data test
            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.AddActivity(good);
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);

            // Bad data test
            result = await ctrl.AddActivity(null);
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }

        [Fact]
        public async void AddContactPostSucceedsOnAdd()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that accepts one Id but not another
            var good = new ContactLog();
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.AddAsync(good)).Returns(Task.FromResult(true));
            repo.Setup(r => r.AddAsync(null)).Returns(Task.FromResult(false));

            // Good data test
            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.AddContact(good);
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);

            // Bad data test
            result = await ctrl.AddContact(null);
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }

        [Fact]
        public async void DeleteSucceedsOnDelete()
        {
            var mailer = new Mock<IEmailSender>();
            // Setup repo mock that succeeds deleting one id
            var log = new ActivityLog();
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.DeleteAsync(goodGuid))
                .Returns(Task.FromResult(true));

            // Good guid test
            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.Delete(goodId);
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);

            // Bad guid test (this never hits the repo)
            result = await ctrl.Delete("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }

        [Fact]
        public async void EmailReportGeneratesEntryPerLog()
        {
            var mailer = new Mock<IEmailSender>();
            mailer.Setup(r => r.SendEmailAsync("", It.IsAny<string>(),
                It.IsRegex(".*conlog.*actlog.*",
                RegexOptions.Multiline & RegexOptions.IgnoreCase)))
                .Returns(Task.FromResult(false));
            // Setup repo mock that succeeds deleting one id
            var con = new ContactLog()
            {
                Id = new Guid(),
                LogDate = DateTime.Now,
                Description = "Conlog"
            };
            var act = new ActivityLog()
            {
                Id = new Guid(),
                LogDate = DateTime.Now,
                Description = "Actlog"
            };
            var repo = new Mock<ILogRepository>();
            repo.Setup(r => r.GetLogAsync(con.Id))
                .Returns(Task.FromResult(con as BaseLog));
            repo.Setup(r => r.GetLogAsync(act.Id))
                .Returns(Task.FromResult(act as BaseLog));

            var ctrl = new LogListsController(repo.Object, mailer.Object);
            var result = await ctrl.EmailReport(new List<Guid> { con.Id, act.Id });
            Assert.IsType<JsonResult>(result);
            dynamic model = result.Value;
            Assert.True(model.success);

            // Bad guid test (this never hits the repo)
            result = await ctrl.Delete("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            Assert.IsType<JsonResult>(result);
            model = result.Value;
            Assert.False(model.success);
        }
    }
}
