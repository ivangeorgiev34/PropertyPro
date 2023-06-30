using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Models
{
    public class Tenant
    {
        public Tenant()
        {
            this.Bookings = new List<Booking>();
            this.Reviews = new List<Review>();
        }

        [Key]
        public Guid Id { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Booking>? Bookings { get; set; }

        public ICollection<Review>? Reviews { get; set; }
    }
}

//update-database -verbose -Project PropertyPro.Infrastructure -StartupProject PropertyPro
