export class newDeviceDTO {
    public macAdress: string;
    public deviceTypeID: string;

    constructor(macaddress: string, devicetypeid: string) {
        this.macAdress = macaddress;
        this.deviceTypeID = devicetypeid;
    }
}
