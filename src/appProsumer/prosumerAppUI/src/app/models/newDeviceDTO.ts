export class newDeviceDTO {
    public macaddress: string;
    public devicetypeid: string;

    constructor(macaddress: string, devicetypeid: string) {
        this.macaddress = macaddress;
        this.devicetypeid = devicetypeid;
    }
}
