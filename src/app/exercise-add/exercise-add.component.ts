import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-exercise-add',
  templateUrl: './exercise-add.component.html',
  styleUrls: ['./exercise-add.component.css']
})
export class ExerciseAddComponent {  

  exercise: {exercisename:string[],frequency: string[], exercisetime: string[], exerciseTimes: string[], exerciseName: string[] } = {
    exercisename:[],
    exercisetime:[],
    frequency:[],
    exerciseTimes: [''],
    exerciseName: ['']

  };
  EverydayX: any;


  weekOptions: Array<any> = [
    { name: 'Sunday', value: 'Sunday'},
    { name: 'Monday', value: 'Monday'},
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' }
  ];
  

  constructor(private userService: UserService, private router: Router, private datePipe: DatePipe) { }


onexercise() { 
  this.userService.exerciseAdd(this.exercise).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Success',
        text: 'Exercise added successfully',
        icon: 'success',
        showConfirmButton: false,
            timer: 2000,
      }).then((result) => {
        if (result) {
          this.router.navigate(['/exercise-history']);
          console.log(response)
        }
      });
    },
    (error: any) => {
      // Registration failed, handle the error
      console.error('Error occurred during add', error);
      // Display an error message or perform any other action
    }
  );
}


addExerciseTime() {
  this.exercise.exerciseTimes.push('');
}

removeExerciseTime(index: number) {
  this.exercise.exerciseTimes.splice(index, 1);
}

addExerciseName() {
  this.exercise.exerciseName.push('');
}

removeExerciseName(index: number) {
  this.exercise.exerciseName.splice(index, 1);
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
