using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device;

public class DeviceOwners
{
    [Key]
    public Guid ID { get; set; }
    
    public Guid DeviceID { get; set; }
    public Device Device { get; set; }
    
    public Guid UserID { get; set; }
    public User User { get; set; }
}