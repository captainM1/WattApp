export class newDeviceDTO {
    public deviceName: string;
    public macAdress: string;
    public deviceTypeID: string;

    constructor(devicename: string, macaddress: string, devicetypeid: string) {
        this.macAdress = macaddress;
        this.deviceTypeID = devicetypeid;
        this.deviceName = devicename;
    }
}
