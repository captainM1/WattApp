export interface User{
    id : string,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    country: string,
    powerUsage:string,
    selected: boolean
   
}
export interface Device{
    id: string,
    macAddress: string,
    deviceTypeID: string,
    deviceType : DeviceType;
    ownerID: string,
    owner: User
   
}
export interface Info{
    deviceId: string;
    deviceTypeName: string;
    macAdress: string;
    manufacturerName: string;
    typeOfDevice: string;
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