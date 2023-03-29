export interface Device {
    name: string;
    manufacturer: string;
    wattage: number;
    macAddress: string;
    collectData:boolean;
    controlTime:boolean;
}
