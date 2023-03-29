namespace prosumerAppBack.Models.Device;

public class DeviceTypeConnection
{
    public Guid DeviceID { get; set; }
    public Device Device { get; set; }

    public Guid DeviceTypeID { get; set; }
    public DeviceType DeviceType { get; set; }
}