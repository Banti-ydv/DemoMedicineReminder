import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgConfirmService } from 'ng-confirm-box';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { UserService } from '../servise/user.service';

export interface PeriodicElement {
  frequency: string;
  emailid: string;
  lastname: string;
  firstname: string;
  id: number;
  name: string;
  shape: string;
  dose: number;
  fromDate: string;
  toDate: string;
  timing: string;
  description: string;
  // frequency: string;

}


@Component({
  selector: 'app-medicine-history',
  templateUrl: './medicine-history.component.html',
  styleUrls: ['./medicine-history.component.css']
})
export class MedicineHistoryComponent implements OnInit{

  displayedColumns: string[] = ['id', 'name', 'shape', 'dose', 'frequency' , 'fromDate', 'toDate', 'timing', 'description', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService
    ) { }



  ngOnInit() {
    this.callApi();
  }


  

  callApi() {
    const apiUrl = 'http://192.168.1.11:8866/mymedicine';
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


    this.http.get<PeriodicElement[]>(apiUrl, { headers }).subscribe(
      (data: PeriodicElement[]) => {
        this.dataSource.data = data;
        
      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }
  
deleteMedicine(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want delete this medicine ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrl = `http://192.168.1.11:8866/deleteMyMedicine/${id}`;
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


      this.http.delete(apiUrl, { headers }).subscribe(
        () => {
          console.log('Medicine deleted successfully.');
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        },
        (error) => {
          console.error('An error occurred while deleting the medicine:', error);
        }
      );
    }
  });
}



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




updateMedicine(element: PeriodicElement): void {
  const formattedfromDate = this.formatfromDate(element.fromDate);
  const formattedtoDate = this.formattoDate(element.toDate);
  Swal.fire({
    title: 'Update Medicine',
    html:
      '<label for="swal-input-name" class="swal2-label">Name:</label>' +
      '<input id="swal-input-name" class="swal2-input custom-width" value="' +
      element.name +
      '"><br>' +
      '<label for="swal-input-shape" class="swal2-label">Shape:</label>' +
      '<input id="swal-input-shape" class="swal2-input custom-width" value="' +
      element.shape +
      '"><br>' +
      '<label for="swal-input-dose" class="swal2-label">Dose:</label>' +
      '<input id="swal-input-dose" class="swal2-input custom-width" value="' +
      element.dose +
      '"><br>' +
      '<label for="swal-input-frequency" class="swal2-label">Frequency:</label>' +
      '<input id="swal-input-frequency" class="swal2-input custom-width" value="' +
      element.frequency +
      '"><br>' +
      '<label for="swal-input-fromDate" class="swal2-label">fromDate:</label>' +
      '<input type="date" id="swal-input-fromDate" class="swal2-input custom-width" value="' +
      formattedfromDate +
      '"><br>' +
      '<label for="swal-input-toDate" class="swal2-label">toDate:</label>' +
      '<input type="date" id="swal-input-toDate" class="swal2-input custom-width" value="' +
      formattedtoDate +
      '"><br>' +
      '<label for="swal-input-timing" class="swal2-label">Timing:</label>' +
      '<input type="time" id="swal-input-timing" class="swal2-input custom-width" value="' +
      element.timing +
      '"><br>' +
      '<label for="swal-input-description" class="swal2-label">Description:</label>' +
      '<input id="swal-input-description" class="swal2-input custom-width" value="' +
      element.description +
      '"><br>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const nameValue = (<HTMLInputElement>document.getElementById('swal-input-name')).value;
      const shapeValue = (<HTMLInputElement>document.getElementById('swal-input-shape')).value;
      const doseValue = (<HTMLInputElement>document.getElementById('swal-input-dose')).value;
      const fromDateValue = (<HTMLInputElement>document.getElementById('swal-input-fromDate')).value;
      const toDateValue = (<HTMLInputElement>document.getElementById('swal-input-toDate')).value;
      const timingValue = (<HTMLInputElement>document.getElementById('swal-input-timing')).value;
      const descriptionValue = (<HTMLInputElement>document.getElementById('swal-input-description')).value;
      const frequencyValue = (<HTMLInputElement>document.getElementById('swal-input-frequency')).value;

      return {
        name: nameValue,
        shape: shapeValue,
        dose: doseValue,
        fromDate: fromDateValue,
        toDate: toDateValue,
        timing: timingValue,
        description: descriptionValue,
        frequency: frequencyValue,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const formValues = result.value;
      if (formValues) {
        const { name, shape, dose, toDate, fromDate, timing, description, frequency } = formValues;

        const apiUrl = `http://192.168.1.11:8866/updateMyMedicine/${element.id}`;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


        const updatedData: PeriodicElement = {
          ...element,
          name: name,
          shape: shape,
          dose: Number(dose),
          toDate: toDate,
          fromDate:fromDate,
          timing: timing,
          description: description,
          frequency: frequency,
        };

        this.http.put(apiUrl, updatedData, { headers }).pipe(
          catchError((error) => {
            console.error('An error occurred while updating the medicine:', error);
            Swal.fire('Error!', 'An error occurred while updating the medicine.', 'error');
            return throwError(error);
          })
        ).subscribe(
          () => {
            console.log('Medicine updated successfully.');

            const updatedElements = this.dataSource.data.map((e) =>
              e.id === element.id ? updatedData : e
            );
            this.dataSource.data = updatedElements;
            Swal.fire('Success!', 'Medicine updated successfully.', 'success');
          },
          (error) => {
            console.error('An error occurred while updating the medicine:', error);
            Swal.fire('Error!', 'An error occurred while updating the medicine.', 'error');
          }
        );
      }
    }
  });
}

formatfromDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    return '';
  }
  
  formattoDate(date: string | null): string {
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


// '<label for="swal-input-name" class="swal2-label">Name:</label>' +
//       '<input id="swal-input-name" class="swal2-input custom-width" value="' +
//       element.name +
//       '"><br>' +
//       '<label for="swal-input-shape" class="swal2-label">Shape:</label>' +
//       '<input id="swal-input-shape" class="swal2-input custom-width" value="' +
//       element.shape +
//       '"><br>' +
//       '<label for="swal-input-dose" class="swal2-label">Dose:</label>' +
//       '<input id="swal-input-dose" class="swal2-input custom-width" value="' +
//       element.dose +
//       '"><br>' +
//       '<label for="swal-input-frequency" class="swal2-label">Frequency:</label>' +
//       '<input id="swal-input-frequency" class="swal2-input custom-width" value="' +
//       element.frequency +
//       '"><br>' +
//       '<label for="swal-input-fromDate" class="swal2-label">fromDate:</label>' +
//       '<input type="date" id="swal-input-fromDate" class="swal2-input custom-width" value="' +
//       formattedfromDate +
//       '"><br>' +
//       '<label for="swal-input-toDate" class="swal2-label">toDate:</label>' +
//       '<input type="date" id="swal-input-toDate" class="swal2-input custom-width" value="' +
//       formattedtoDate +
//       '"><br>' +
//       '<label for="swal-input-timing" class="swal2-label">Timing:</label>' +
//       '<input type="time" id="swal-input-timing" class="swal2-input custom-width" value="' +
//       element.timing +
//       '"><br>' +
//       '<label for="swal-input-description" class="swal2-label">Description:</label>' +
//       '<input id="swal-input-description" class="swal2-input custom-width" value="' +
//       element.description +
//       '"><br>',