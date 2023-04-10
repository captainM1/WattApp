import { Pipe, PipeTransform } from "@angular/core";
import { User } from "models/User";
@Pipe({
    name: 'filterName'
})
export class FilterPipe implements PipeTransform{
    transform(allUsers : User[], _searchByName:string) {
       if(allUsers.length === 0 || _searchByName === ''){
        return allUsers;
       }else{
        return allUsers.filter((user) => {
           return user.firstName.toLowerCase() === _searchByName.toLowerCase();
        })
       }
    }
}
