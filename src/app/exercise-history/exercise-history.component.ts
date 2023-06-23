import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgConfirmService } from 'ng-confirm-box';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserService } from '../servise/user.service';

import { KeyService } from '../servise/key.service';
import * as moment from 'moment';

export interface PeriodicElement {
  id: number;
  exercisename: string;
  // date: string;
  exercisetime: string;

}

@Component({
  selector: 'app-exercise-history',
  templateUrl: './exercise-history.component.html',
  styleUrls: ['./exercise-history.component.css']
})
export class ExerciseHistoryComponent implements OnInit {

  displayedColumns: string[] = ['position', 'exercisename', 'exercisetime', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    private key: KeyService
  ) { }



  ngOnInit() {
    this.callApi();
  }




  callApi() {
    const token = localStorage.getItem('token'); // Replace with your actual token

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElement[]>(this.key.myExercise, { headers }).subscribe(
      (data: PeriodicElement[]) => {
        this.dataSource.data = data;

      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }


  deleteExercise(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want delete this exercise ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


        this.http.delete(this.key.deleteMyExercise + `${id}`, { headers }).subscribe(
          () => {
            console.log('Exercise deleted successfully.');
            Swal.fire({
              title: 'Deleted!',
              text: 'Your exercise has been deleted.',
              icon: 'success',
              showConfirmButton: true,
              timer: 3000,
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          },
          (error) => {
            console.error('An error occurred while deleting the exercise:', error);
          }
        );
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateExercise(element: PeriodicElement): void {
    const formatTime = this.formatTime(element.exercisetime);
    Swal.fire({
      title: 'Update Exercise',
      html:
        '<label for="swal-input-exercisename" class="swal2-label">Name:</label>' +
        '<input id="swal-input-exercisename" class="swal2-input" value="' +
        element.exercisename +
        '"><br>' +
        // '<label for="swal-input-date" class="swal2-label">Date:</label>' +
        // '<input type="date" id="swal-input-date" class="swal2-input" value="' +
        // formattedDate +
        // '"><br>' +
        '<label for="swal-input-exercisetime" class="swal2-label">Time:</label>' +
        '<input type="time" id="swal-input-exercisetime" class="swal2-input" value="' +
        formatTime +
        '"><br>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const nameValue = (<HTMLInputElement>document.getElementById('swal-input-exercisename')).value;
        // const shapeValue = (<HTMLInputElement>document.getElementById('swal-input-shape')).value;
        // const doseValue = (<HTMLInputElement>document.getElementById('swal-input-dose')).value;
        // const dateValue = (<HTMLInputElement>document.getElementById('swal-input-date')).value;
        const timeValue = (<HTMLInputElement>document.getElementById('swal-input-exercisetime')).value;
        // const descriptionValue = (<HTMLInputElement>document.getElementById('swal-input-description')).value;

        return {
          exercisename: nameValue,
          // date: dateValue,
          exercisetime: timeValue,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { exercisename, exercisetime } = formValues;

          if (!exercisename || !exercisetime) {
            Swal.fire('Error!', 'Please fill all the input fields.', 'error');
            return;
          }

          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


          const updatedData: PeriodicElement = {
            ...element,
            exercisename: exercisename,
            // date: date,
            exercisetime: exercisetime,
          };

          this.http.put(this.key.updateMyExercise + `${element.id}`, updatedData, { headers }).subscribe(
            () => {
              console.log('Exercise updated successfully.');

              const updatedElements = this.dataSource.data.map((e) =>
                e.id === element.id ? updatedData : e
              );
              this.dataSource.data = updatedElements;
              Swal.fire('Success!', 'Exercise updated successfully.', 'success');
            },
            (error) => {
              console.error('An error occurred while updating the Exercise:', error);
              Swal.fire('Error!', 'An error occurred while updating the Exercise.', 'error');
            }
          );
        }
      }
    });
  }

  // formatDate(date: string | null): string {
  //   if (date) {
  //     const parsedDate = new Date(date);
  //     const year = parsedDate.getFullYear();
  //     const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
  //     const day = ('0' + parsedDate.getDate()).slice(-2);
  //     return `${year}-${month}-${day}`;
  //   }
  //   return '';
  // }

  formatTime(time: string): string {
    if (!time) {
      return '';
    }
  
    const formattedTime = moment(time, 'h:mm A').format('HH:mm');
    return formattedTime;
  }
  

}
