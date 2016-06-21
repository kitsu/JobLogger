using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;


namespace JobLogger.Models
{
    public enum ContactType { Application, Interview, Inquery }
    public enum ContactMeans { Online, Mail, InPerson, Kiosk, Telephone, Fax }
    public abstract class BaseLog
    {
        public Guid Id { get; set; }

        // Reciprocal link to user data
        [JsonIgnore]
        public virtual ApplicationUser ApplicationUser  { get; set; }

        [Required]
        [Display(Name = "Log Date")]
        [DataType(DataType.Date)]
        public DateTime LogDate { get; set; }

        [Required]
        [StringLength(256)]
        public string Description { get; set; }
    }

    public class ActivityLog : BaseLog
    {
        [Required]
        [StringLength(64)]
        public string Location { get; set; }
    }

    public class ContactLog : BaseLog
    {

        [Required]
        public ContactType ContactType { get; set; }

        [Required]
        public ContactMeans ContactMeans { get; set; }

        [Required]
        [StringLength(64)]
        public string Employer { get; set; }

        [Required]
        [StringLength(64)]
        public string Contact { get; set; }

        [DataType(DataType.PhoneNumber)]
        [StringLength(13)]
        public string Phone { get; set; }

        // Reuse for both web, email, and street address
        [Required]
        [StringLength(64)]
        public string Address { get; set; }

        [Required]
        [StringLength(32)]
        public string City { get; set; }

        [Required]
        [StringLength(32)]
        public string State { get; set; }
    }
}
