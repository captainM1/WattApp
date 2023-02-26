import { Component, OnInit } from '@angular/core';
import { Task } from './models/task.model';
import { TasksService } from './services/tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front';
  tasks: Task[] = [];
  task: Task = {
    id: '',
    taskTitle: '',
    taskUser: '',
    taskDescription: ''
  }
  constructor(private tasksService: TasksService) {

  }
  ngOnInit(): void {
    this.getAllTasks();
  }
  getAllTasks() {
    this.tasksService.getAllTasks()
      .subscribe(
        response => {
          this.tasks = response;
        }
      );
  }
  onSubmit() {
    this.tasksService.addCard(this.task)
      .subscribe(
        response => {
          this.getAllTasks();
          this.task = {
            id: '',
            taskTitle: '',
            taskUser: '',
            taskDescription: ''
          }
        }
      )
  }
}
