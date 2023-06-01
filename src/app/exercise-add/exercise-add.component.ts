import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.component.html',
  styleUrls: ['./exercise-add.component.css']
})
export class ExerciseAddComponent {

  exercise = {
    exercisename:'',
    date:'',
    exercisetime:''
  }

  constructor(private userService: UserService, private router: Router, private datePipe: DatePipe) { }

  onexercise() {  // Update the method name to match the one used in the template
    this.userService.exerciseAdd(this.exercise).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Add successful', response);
        // Redirect to a success page or perform any other action
        this.router.navigate(['/exercise-history']);

      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during add', error);
        // Display an error message or perform any other action
      }
    );
  }


  formatDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    return '';
  }
}
