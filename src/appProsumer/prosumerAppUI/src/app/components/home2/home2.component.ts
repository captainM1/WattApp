import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
  currentUsage! : any;
  averageUsage! : any;
  userID!: any;
  token!:any;
  constructor(
		private auth : AuthService,
    private auth1 : AuthUserService,
	){}

  ngOnInit(): void {
    this.getToken();
  }

  currentUsageUser(id:any){
    this.auth1.getCurrentUsageUserSummary(id).subscribe(
      (response : any) => {
        this.currentUsage = response;
        console.log(response);
      }
    )
  }

  averageUsegaUser(id:any){
    this.auth1.getAverageUserUsage(id).subscribe(
      (response : any) => {
        this.averageUsage = response;
      }
    )
  }

  getToken(){
    this.token = this.auth.getToken();
    this.auth1.getThisUser(this.token).subscribe(
      (response :any)=>{
       this.userID = response.id;
       console.log(this.userID);
       this.currentUsageUser(this.userID);
      this.averageUsegaUser(this.userID);
      }
    )
  }


}
