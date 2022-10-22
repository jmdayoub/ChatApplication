using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class MessageAddRequest
    {
        [Required]
        [MinLength(2)]
        public string Message { get; set; }
        public string Subject { get; set; }
        [Required]
        [Range(1,int.MaxValue)]
        public int RecipientId { get; set; }
        [Required]
        public int SenderId { get; set; }
        [Required]
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
    }
}
