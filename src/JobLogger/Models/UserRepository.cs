using JobLogger.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobLogger.Models
{
    public interface IUserRepository
    {
        string GetUserName(string userId);
    }

    public class UserRepository: IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;    
        }

        public string GetUserName(string userId)
        {
            var users = from user in _context.Users
                        where user.Id == userId
                        select user;
            if (users.Count() > 0)
            {
                return users.First().UserName;
            }
            return "";
        }
    }
}
