export class newDeviceDTO {
    public macAdress: string;
    public deviceTypeID: string;
    public sharesDataWithDso: boolean;
    public dsoHasControl: boolean;

    constructor(macaddress: string, devicetypeid: string, sharesData: boolean, controls: boolean) {
        this.macAdress = macaddress;
        this.deviceTypeID = devicetypeid;
        this.sharesDataWithDso = sharesData;
        this.dsoHasControl = controls;
    }
}
