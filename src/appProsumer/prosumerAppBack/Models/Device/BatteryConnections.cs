using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device
{
    public class BatteryConnections
    {        
        public Guid BatteryID { get; set; } 
        public Device Device { get; set; }

    }
}
