import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  data:any;
  constructor(
    private auth: AuthService,
    ){}
  ngOnInit(): void {
    this.auth.getData().subscribe((data) => {
      this.data = "Welcome, " + data.Result;
    });
  }
}
