import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { AuthService } from '../servise/auth.service';
import { KeyService } from '../servise/key.service';
import { UserService } from '../servise/user.service';
import Swal from 'sweetalert2';

export interface Exercise {
  exercisename: string[];
  exercisetime: string[];
  frequency: string[];
  // exerciseTimes: string[];
  // exerciseName: string[];
}
@Component({
  selector: 'app-exercise-update',
  templateUrl: './exercise-update.component.html',
  styleUrls: ['./exercise-update.component.css']
})
export class ExerciseUpdateComponent {

  exercise: Exercise = {
    exercisename: [],
    exercisetime: [],
    frequency: [],
    // exerciseTimes: [],
    // exerciseName: [],
  };
  EverydayX: any;
  weekOptions: Array<any> = [
    { name: 'Sunday', value: 'Sunday' },
    { name: 'Monday', value: 'Monday' },
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' }
  ];

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    private key: KeyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.callApi();
  }

  callApi() {
    const token = localStorage.getItem('token');

    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    // Set the token in the request headers    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updateUrl = `http://192.168.1.11:8866/getExerciseBy/${employeeId}`;
    // Fetch the team leads from the API endpoint
    this.http.get(updateUrl, { headers })
      .subscribe(
        (response: any) => {
          //this.profileDetails = response;
          // this.appointment.dose = response.dose;
          this.exercise.exercisename = response.exercisename;
          this.exercise.exercisetime = response.exercisetime;
          this.exercise.frequency = response.frequency;

          console.error('response=======>', response);
        },
        (error) => {
          console.error('An error occurred while calling the API:', error);
        }
      );
  }


  addExerciseTime() {
    this.exercise.exercisetime.push('');
  }

  removeExerciseTime(index: number) {
    this.exercise.exercisetime.splice(index, 1);
  }

  addExerciseName() {
    this.exercise.exercisename.push('');
  }

  removeExerciseName(index: number) {
    this.exercise.exercisename.splice(index, 1);
  }

  updateExerciseData() {

    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    const url = `http://192.168.1.11:8866/updateMyExercise/${employeeId}`;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updatedExerciseData: Exercise = {
      exercisename: this.exercise.exercisename,
      exercisetime: this.exercise.exercisetime,
      frequency: this.exercise.frequency,
      // exerciseName: this.exercise.exerciseName,
      // exerciseTimes: this.exercise.exerciseTimes,

    };

    this.http.put(url, updatedExerciseData, { headers }).subscribe(
      () => {
        console.log('Data updated successfully!');
        Swal.fire({
          title: 'Updated!',
          text: 'Appointment updated successfully.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result) {
            // location.reload();
            this.router.navigate(['/exercise-history'])
          }
        });
        // Show success message or perform any other action
      },
      (error) => {
        console.error('Failed to update data:', error);
        // Show error message or perform any other action
      }
    );
  }
}

