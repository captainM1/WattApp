using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device
{
    public class BatteryConnections
    {        
        public Guid BatteryID { get; set; }
        [Key]
        public Guid DeviceID { get; set; }
        public Device Device { get; set; }

    }
}
