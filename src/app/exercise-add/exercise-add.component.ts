import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';

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

  constructor(private userService: UserService, private router: Router) { }

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

}
