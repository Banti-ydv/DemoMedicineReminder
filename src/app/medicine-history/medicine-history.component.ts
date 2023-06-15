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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PeriodicElement {
  frequency: string;
  emailid: string;
  lastname: string;
  firstname: string;
  id: number;
  name: string;
  shape: string;
  dose: string[];
  fromDate: string;
  toDate: string;
  timing: string[];
  description: string;
  // frequency: string;

}


@Component({
  selector: 'app-medicine-history',
  templateUrl: './medicine-history.component.html',
  styleUrls: ['./medicine-history.component.css']
})
export class MedicineHistoryComponent implements OnInit{


  medicines: { timing: string; dose: string }[] = [{ timing: '', dose: '' }];
  timingsArray: string[] = [];
  doseArray: string[] = [];
  
  doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1);


  displayedColumns: string[] = ['id', 'name', 'shape', 'dose', 'frequency' , 'fromDate', 'toDate', 'timing', 'description', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  selectedElement: any;
  updateMedicineForm: FormGroup;
  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
    ) {
      this.updateMedicineForm = this.formBuilder.group({
        name: ['', Validators.required],
        shape: ['', Validators.required]
      });
     }



  ngOnInit() {
    this.callApi();
  }

  setSelectedElement(element: any) {
    this.selectedElement = { ...element }; // Create a copy of the selected element to avoid direct mutation
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
          location.reload();
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

  updateMedicine(formValue: any) {
    const updatedMedicine = {
      id: this.selectedElement.id,
      name: formValue.name,
      shape: formValue.shape,
      // Include other properties as needed
    };
    if (this.selectedElement && this.selectedElement.id) {
      const url = `http://192.168.1.11:8866/updateMyMedicine/${this.selectedElement.id}`;
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);

      const requestBody = {
        name: updatedMedicine.name,
        shape: updatedMedicine.shape
        // Add other properties to update if needed
      };

      this.http.put(url, requestBody, { headers }).subscribe(
        response => {
          console.log('Medicine updated successfully:', response);
          location.reload();
          // Handle success message or perform additional actions
        },
        error => {
          console.error('Error updating medicine:', error);
          // Handle error message or perform error handling
        }
      );
    }
  }

  addMedicine() {
    this.medicines.push({ timing: '', dose: '' });
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
  }

  
formatfromDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${month}/${day}/${year}`;
    }
    return '';
  }
  
  formattoDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${month}/${day}/${year}`;
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