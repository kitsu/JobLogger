using JobLogger.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace JobLogger.Models
{
    public interface ILogRepository
    {
        Task<IEnumerable<BaseLog>> JobLogsAsync();
        Task<bool> AddAsync(BaseLog log);
        Task<BaseLog> GetLogAsync(Guid logId);
        Task<bool> UpdateAsync(BaseLog log);
        Task<bool> DeleteAsync(Guid logId);
    }

    public class LogRepository : ILogRepository
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public LogRepository(IHttpContextAccessor httpContextAccessor,
                             UserManager<ApplicationUser> userManager,
                             ApplicationDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _context = context;    
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            var user = _httpContextAccessor.HttpContext.User;
            return await _userManager.GetUserAsync(user);
        }

        public async Task<IEnumerable<BaseLog>> JobLogsAsync()
        {
            var cuser = await GetCurrentUser();
            if (cuser != null)
            {
                var uid = cuser.Id;
                var logs = from log in _context.JobLogs
                           where log.ApplicationUser.Id == uid
                           orderby log.LogDate
                           select log;
                return logs.ToList();
            }
            return new List<BaseLog>();
        }

        public async Task<bool> AddAsync(BaseLog log)
        {
            var cuser = await GetCurrentUser();
            if (cuser != null)
            {
                if (cuser.JobLogs == null)
                {
                     cuser.JobLogs = new List<BaseLog>();
                }
                var logs = cuser.JobLogs;
                logs.Add(log);
                await _userManager.UpdateAsync(cuser);
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateAsync(BaseLog updated)
        {
            var cuser = await GetCurrentUser();
            if (cuser != null)
            {
                var uid = cuser.Id;
                var logs = from log in _context.JobLogs
                           where log.ApplicationUser.Id == uid
                           where log.Id == updated.Id
                           select log;
                if (logs.Count() > 0)
                {
                    var exist = logs.First();
                    Type DestType = exist.GetType();
                    Type SrcType = updated.GetType();
                    if (SrcType == DestType)
                    {
                        foreach (var prop in SrcType.GetProperties())
                        {
                            prop.SetValue(exist, prop.GetValue(updated, null), null);
                        }
                        await _userManager.UpdateAsync(cuser);
                        return true;
                    }
                }
            }
            return false;
        }

        public async Task<bool> DeleteAsync(Guid logId)
        {
            var cuser = await GetCurrentUser();
            if (cuser != null)
            {
                var uid = cuser.Id;
                var logs = from log in _context.JobLogs
                           where log.ApplicationUser.Id == uid
                           where log.Id == logId
                           select log;
                if (logs.Count() > 0)
                {
                    cuser.JobLogs.Remove(logs.First());
                    await _userManager.UpdateAsync(cuser);
                    return true;
                }
            }
            return false;
        }

        public async Task<BaseLog> GetLogAsync(Guid logId)
        {
            var cuser = await GetCurrentUser();
            if (cuser != null)
            {
                var uid = cuser.Id;
                var logs = from log in _context.JobLogs
                           where log.ApplicationUser.Id == uid
                           where log.Id == logId
                           select log;
                return logs.First();
            }
            return null;
        }
    }
}
