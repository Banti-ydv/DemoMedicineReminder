import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgConfirmService } from 'ng-confirm-box';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  id: number;
  name: string;
  shape: string;
  dose: number;
  date: string;
  timing: string;
  description: string;

}


@Component({
  selector: 'app-medicine-history',
  templateUrl: './medicine-history.component.html',
  styleUrls: ['./medicine-history.component.css']
})
export class MedicineHistoryComponent implements OnInit{

  displayedColumns: string[] = ['id', 'name', 'shape', 'dose', 'date', 'timing', 'description', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    ) { }



  ngOnInit() {
    this.callApi();
  }


  

  callApi() {
    const apiUrl = 'http://192.168.1.11:8866/mymedicine';
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
  
deleteMedicine(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrl = `http://192.168.1.11:8866/deleteMyMedicine/${id}`;
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

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

  // updateMedicine(element: PeriodicElement): void {
  //   Swal.fire({
  //     title: 'Update Medicine',
  //     html:
  //       '<input id="swal-input1" class="swal2-input" value="' +
  //       element.name +
  //       '">' +
  //       '<input id="swal-input2" class="swal2-input" value="' +
  //       element.dose +
  //       '">',
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: 'Update',
  //     cancelButtonText: 'Cancel',
  //     preConfirm: () => {
  //       const input1Value = (<HTMLInputElement>document.getElementById('swal-input1')).value;
  //       const input2Value = (<HTMLInputElement>document.getElementById('swal-input2')).value;
  //       return [input1Value, input2Value];
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const formValues = result.value;
  //       if (formValues) {
  //         const name = formValues[0];
  //         const dose = formValues[1];
  //         const apiUrl = `http://192.168.1.11:8866/updateMyMedicine/${element.id}`;
  //         const token = localStorage.getItem('token');
  //         const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  //         const updatedData: PeriodicElement = {
  //           ...element,
  //           name: name,
  //           dose: parseInt(dose),
  //         };
  
  //         this.http.put(apiUrl, updatedData, { headers }).subscribe(
  //           () => {
  //             console.log('Medicine updated successfully.');
  
  //             const updatedElements = this.dataSource.data.map((e) =>
  //               e.id === element.id ? updatedData : e
  //             );
  //             this.dataSource.data = updatedElements;
  //             Swal.fire('Success!', 'Medicine updated successfully.', 'success');
  //           },
  //           (error) => {
  //             console.error('An error occurred while updating the medicine:', error);
  //             Swal.fire('Success!', 'Medicine updated successfully.', 'success');
  //           }
  //         );
  //       }
  //     }
  //   });
  // }
 
  
  updateMedicine(element: PeriodicElement): void {
    Swal.fire({
      title: 'Update Medicine',
      html:
        '<input id="swal-input-name" class="swal2-input" value="' +
        element.name +
        '">' +
        '<input id="swal-input-shape" class="swal2-input" value="' +
        element.shape +
        '">' +
        '<input id="swal-input-dose" class="swal2-input" value="' +
        element.dose +
        '">' +
        '<input id="swal-input-date" class="swal2-input" value="' +
        element.date +
        '">' +
        '<input id="swal-input-timing" class="swal2-input" value="' +
        element.timing +
        '">' +
        '<input id="swal-input-description" class="swal2-input" value="' +
        element.description +
        '">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const nameValue = (<HTMLInputElement>document.getElementById('swal-input-name')).value;
        const shapeValue = (<HTMLInputElement>document.getElementById('swal-input-shape')).value;
        const doseValue = (<HTMLInputElement>document.getElementById('swal-input-dose')).value;
        const dateValue = (<HTMLInputElement>document.getElementById('swal-input-date')).value;
        const timingValue = (<HTMLInputElement>document.getElementById('swal-input-timing')).value;
        const descriptionValue = (<HTMLInputElement>document.getElementById('swal-input-description')).value;
  
        return {
          name: nameValue,
          shape: shapeValue,
          dose: doseValue,
          date: dateValue,
          timing: timingValue,
          description: descriptionValue,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { name, shape, dose, date, timing, description } = formValues;
  
          const apiUrl = `http://192.168.1.11:8866/updateMyMedicine/${element.id}`;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
          const updatedData: PeriodicElement = {
            ...element,
            name: name,
            shape: shape,
            dose: Number(dose),
            date: date,
            timing: timing,
            description: description,
          };
  
          this.http.put(apiUrl, updatedData, { headers }).subscribe(
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
  
}