import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmpleyeesService } from 'src/app/services/empleyees.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  employeeDetails: Employee = 
  {
    id: '',
    name: '',
    email: '',
    phone: 0,
    salary: 0,
    department: ''
  };

  constructor(private route: ActivatedRoute, private employeeService: EmpleyeesService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) =>
      {
        const id = params.get('id');

        if(id)
        {
          this.employeeService.getEmployee(id).subscribe({
            next: (response) =>
            {
              this.employeeDetails = response;
            }
          })
        }
      }
    })
  }

}
