import { Pipe, PipeTransform } from "@angular/core";
import { User } from "models/User";
@Pipe({
    name: 'filterAddress'
})
export class FilterPipeAddress implements PipeTransform{
    transform(allUsers : User[], _searchByCity : string) {
       if(allUsers.length === 0 || _searchByCity === ''){
        return allUsers;
       }else{
        return allUsers.filter((user) => {
            console.log(user.city)
            return user.city.toLowerCase() === _searchByCity.toLowerCase();
        })
       }
    }
    
}