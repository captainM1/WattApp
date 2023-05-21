using System.ComponentModel.DataAnnotations;

namespace prosumerAppBack.Models.Device
{
    public class BatteryStatus
    {
        [Key]
        public Guid ID { get; set; }
        public DateTime Date { get; set; }
        public double BatteryPercent { get; set; }
    }
}
