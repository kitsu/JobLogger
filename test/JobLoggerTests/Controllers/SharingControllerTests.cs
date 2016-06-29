using System;
using System.Linq;
using Xunit;
using JobLogger.Controllers;
using JobLogger.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using JobLogger.Data;
using Microsoft.EntityFrameworkCore;

namespace JobLoggerTests
{
    public class TestSharingController
    {
        [Fact]
        public void IndexWithNoArgsReturnsView()
        {
            var logRepo = new Mock<ILogRepository>();
            var userRepo = new Mock<IUserRepository>();

            var ctrl = new SharingController(logRepo.Object, userRepo.Object);
            var result = ctrl.Index(null, null);
            Assert.IsType<ViewResult>(result);
            var view = result as ViewResult;
        }

        [Fact]
        public void IndexWithUserButNoLogsSetsViewDataUserName()
        {
            var userId = "FakeId";
            var userName = "FakeUser";
            var logRepo = new Mock<ILogRepository>();
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(r => r.GetUserName(userId))
                .Returns(userName);

            var ctrl = new SharingController(logRepo.Object, userRepo.Object);
            var result = ctrl.Index(userId, null);
            Assert.IsType<ViewResult>(result);
            var view = result as ViewResult;
            Assert.Equal(view.ViewData["UserName"], userName);
            Assert.Null(view.Model);
        }

        [Fact]
        public void IndexWithUserAndLogsSetsViewDataAndModel()
        {
            var log = new ActivityLog();
            var logId = Guid.NewGuid();
            var userId = "FakeId";
            var userName = "FakeUser";
            var logRepo = new Mock<ILogRepository>();
            logRepo.Setup(r => r.GetLogAsync(userId, logId)).Returns(log);
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(r => r.GetUserName(userId)).Returns(userName);

            var ctrl = new SharingController(logRepo.Object, userRepo.Object);
            var result = ctrl.Index(userId, logId.ToString());
            Assert.IsType<ViewResult>(result);
            var view = result as ViewResult;
            Assert.Equal(view.ViewData["UserName"], userName);
            var model = view.Model as List<BaseLog>;
            Assert.Equal(model.Count, 1);
            Assert.Equal(model[0], log);
        }

        [Fact]
        public void IndexWithInvalidUserReturnsView()
        {
            var log = new ActivityLog();
            var logId = Guid.NewGuid();
            var userId = "FakeId";
            var userName = "FakeUser";
            var logRepo = new Mock<ILogRepository>();
            logRepo.Setup(r => r.GetLogAsync(userId, logId)).Returns(log);
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(r => r.GetUserName(userId)).Returns(userName);

            var ctrl = new SharingController(logRepo.Object, userRepo.Object);
            var result = ctrl.Index("invalid", logId.ToString());
            Assert.IsType<ViewResult>(result);
            var view = result as ViewResult;
            Assert.False(view.ViewData.ContainsKey("UserName"));
            Assert.Null(view.Model);
        }

        [Fact]
        public void IndexWithInvalidLogReturnsView()
        {
            var log = new ActivityLog();
            var logId = Guid.NewGuid();
            var userId = "FakeId";
            var userName = "FakeUser";
            var logRepo = new Mock<ILogRepository>();
            logRepo.Setup(r => r.GetLogAsync(userId, logId)).Returns(log);
            logRepo.Setup(r => r.GetLogAsync(userId, It.IsAny<Guid>())).Returns((BaseLog)null);
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(r => r.GetUserName(userId)).Returns(userName);

            var ctrl = new SharingController(logRepo.Object, userRepo.Object);
            var result = ctrl.Index(userId, Guid.NewGuid().ToString());
            Assert.IsType<ViewResult>(result);
            var view = result as ViewResult;
            Assert.Equal(view.ViewData["UserName"], userName);
            var model = view.Model as List<BaseLog>;
            Assert.Equal(model.Count, 0);
        }

        [Fact]
        public void IndexWithMixedValidLogsReturnsView()
        {
            var log = new ActivityLog();
            var logId = Guid.NewGuid();
            var userId = "FakeId";
            var userName = "FakeUser";
            var logRepo = new Mock<ILogRepository>();
            logRepo.Setup(r => r.GetLogAsync(userId, logId)).Returns(log);
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(r => r.GetUserName(userId)).Returns(userName);

            var ctrl = new SharingController(logRepo.Object, userRepo.Object);
            var result = ctrl.Index(userId, logId + ",invalid");
            Assert.IsType<ViewResult>(result);
            var view = result as ViewResult;
            Assert.Equal(view.ViewData["UserName"], userName);
            var model = view.Model as List<BaseLog>;
            Assert.Equal(model.Count, 1);
            Assert.Equal(model[0], log);
        }
    }
}
