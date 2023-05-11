using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models
{
    public class UsersRequestedToDso
    {
        [Key]
        public Guid ID { get; set; }
        
        public Guid UserID { get; set; }
        
        public bool Approved { get; set; }
    }
}
