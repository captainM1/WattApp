import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit{

  employees: Employee[] = [
    {
      id: '5b4ed4cc-f316-444b-a06e-05ce7b322892',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: 998877665,
      salary: 60000,
      department: 'Human Resources'
    },
    {
      id: '5b4ed4cc-c316-444b-a06e-05ce73456892',
      name: 'Sameer Saini',
      email: 'sameer.saini@email.com',
      phone: 880987665,
      salary: 150000,
      department: 'Information technologies'
    }
  ];

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
