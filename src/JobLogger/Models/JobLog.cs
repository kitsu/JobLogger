﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace JobLogger.Models
{
    public enum MethodType { Application, Interview, Inquery }
    public enum MeansType { Online, Mail, InPerson, Kiosk, Telephone, Fax }

    public abstract class BaseLog
    {
        public Guid Id { get; set; }

        // Reciprocal link to user data
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
        public MethodType MethodType { get; set; }

        [Required]
        public MeansType MeansType { get; set; }

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
