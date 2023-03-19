export interface Device {
    manufacturer: string;
    wattage: number;
    frequency: number;
    mac: string;
    name:string;
    time:number;
    collectData:boolean;
    controlTime:boolean;
}
