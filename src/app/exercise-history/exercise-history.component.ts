// import { Component } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';

// export interface PeriodicElement {
//   position: number;
//   exercisename: string;
//   date: string;
//   exercisetime: string;

// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, exercisename: 'Hydrogen', date: '11/01/1018', exercisetime: '11:10 am'},
//   {position: 2, exercisename: 'Helium', date: '22/02/2028', exercisetime: '02:20 am'},
// ];


// @Component({
//   selector: 'app-exercise-history',
//   templateUrl: './exercise-history.component.html',
//   styleUrls: ['./exercise-history.component.css']
// })
// export class ExerciseHistoryComponent {

//   displayedColumns: string[] = ['position', 'exercisename', 'date', 'exercisetime', 'edit', 'delete'];
//   dataSource = new MatTableDataSource(ELEMENT_DATA);

//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
// }








import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgConfirmService } from 'ng-confirm-box';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  id: number;
  exercisename: string;
  date: string;
  exercisetime: string;

}

@Component({
  selector: 'app-exercise-history',
  templateUrl: './exercise-history.component.html',
  styleUrls: ['./exercise-history.component.css']
})
export class ExerciseHistoryComponent implements OnInit{

  displayedColumns: string[] = ['position', 'exercisename', 'date', 'exercisetime', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router
    ) { }

   

  ngOnInit() {
    this.callApi();
  }


  

  callApi() {
    const apiUrl = 'http://192.168.1.11:8866/myExercise';
    const token = localStorage.getItem('token'); // Replace with your actual token

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<PeriodicElement[]>(apiUrl, { headers }).subscribe(
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
        const apiUrl = `http://192.168.1.11:8866/deleteMyExercise/${id}`;
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
        this.http.delete(apiUrl, { headers }).subscribe(
          () => {
            console.log('Exercise deleted successfully.');
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
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
    Swal.fire({
      title: 'Update Exercise',
      html:
        '<input id="swal-input-exercisename" class="swal2-input" value="' +
        element.exercisename +
        '">' +
        '<input id="swal-input-date" class="swal2-input" value="' +
        element.date +
        '">' +
        '<input id="swal-input-exercisetime" class="swal2-input" value="' +
        element.exercisetime +
        '">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const nameValue = (<HTMLInputElement>document.getElementById('swal-input-exercisename')).value;
        // const shapeValue = (<HTMLInputElement>document.getElementById('swal-input-shape')).value;
        // const doseValue = (<HTMLInputElement>document.getElementById('swal-input-dose')).value;
        const dateValue = (<HTMLInputElement>document.getElementById('swal-input-date')).value;
        const timeValue = (<HTMLInputElement>document.getElementById('swal-input-exercisetime')).value;
        // const descriptionValue = (<HTMLInputElement>document.getElementById('swal-input-description')).value;
  
        return {
          exercisename: nameValue,
          date: dateValue,
          exercisetime: timeValue,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { exercisename, date, exercisetime} = formValues;
  
          const apiUrl = `http://192.168.1.11:8866/updateMyExercise/${element.id}`;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
          const updatedData: PeriodicElement = {
            ...element,
            exercisename: exercisename,
            date: date,
            exercisetime: exercisetime,
          };
  
          this.http.put(apiUrl, updatedData, { headers }).subscribe(
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
  
}
