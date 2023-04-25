export interface User{
    id : string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    country: string,
    consumption:number,
    production:number,
    summary:number,
    selected: boolean
   
}
export interface Device{
    deviceId: string;
    deviceTypeName: string;
    macAdress: string;
    manufacturerName: string;
    typeOfDevice: string;
    powerusage:number;
   
}
export interface Info{
    powerusage: any;
    deviceId: string;
    deviceTypeName: string;
    macAdress: string;
    manufacturerName: string;
    typeOfDevice: string;
    powerUsage:string;

}

export interface DeviceType{
    id: string,
    name: string,
    groupID: string,
    group: DeviceGroup;
    manifacturerID: string,
    manifacturer: DeviceManifacturers,
    wattage: number,
    devices: Device[]
}

export interface DeviceGroup{
    id: string,
    name: string,
    devicesTypes: DeviceType[];
}
export interface DeviceManifacturers{
    id: string,
    name: string,
    deviceTypes: DeviceType[];
}