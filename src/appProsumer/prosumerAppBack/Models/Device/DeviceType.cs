using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device;

public class DeviceType
{
    [Key]
    public Guid ID { get; set; }
    public string Name { get; set; }
    
    public virtual ICollection<DeviceTypeConnection> DeviceDeviceTypes { get; set; }
}