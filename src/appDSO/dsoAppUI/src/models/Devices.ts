export interface deviceGroup{
    id: string,
    name: string,
    deviceType: string
}
export interface deviceManifacturers{
    manufacturerID: string,
    manufacturerName: string
    
}
export interface deviceGroupManifacturers{
    id:string,
    name: string,
    groupID:string,
    manifacturerID: string,
    manifacturer: string,
    wattage: number,
    devices: string
}