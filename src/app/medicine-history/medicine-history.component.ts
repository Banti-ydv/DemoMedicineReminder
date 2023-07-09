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
import { KeyService } from '../servise/key.service';
import * as moment from 'moment';


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


  // displayedColumns: string[] = ['id', 'name', 'shape', 'dose', 'frequency' , 'fromDate', 'toDate', 'timing', 'description', 'edit', 'delete'];
  displayedColumns: string[] = ['id', 'name', 'shape', 'fromDate', 'toDate', 'view','delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  selectedElement: any;
  updateMedicineForm: FormGroup;
  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private key : KeyService
    ) {
      this.updateMedicineForm = this.formBuilder.group({
        name: ['', Validators.required],
        shape: ['', Validators.required],
        frequency: ['',Validators.required],
        fromDate: ['',Validators.required],
        toDate: ['',Validators.required],
        description: ['',Validators.required],
        dose: ['',Validators.required],
        timing: ['',Validators.required], 

      });
     }



  ngOnInit() {
    this.callApi();
  }

  setSelectedElement(element: any) {
    this.selectedElement = { ...element }; // Create a copy of the selected element to avoid direct mutation
  }


  

  callApi() {
  
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElement[]>(this.key.mymedicine, { headers }).subscribe(
      (data: PeriodicElement[]) => {
        // Reverse the received array
        const reversedData = data.reverse();
  
        // Set the reversed array as the data source
        this.dataSource.data = reversedData;
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
    
      const token = localStorage.getItem('token'); 
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


      this.http.delete(this.key.deleteMyMedicine+`${id}`, { headers }).subscribe(
        () => {
          console.log('Medicine deleted successfully.');
          Swal.fire({
            title: 'Deleted!',
            text: 'Your medicine has been deleted.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          }).then((result) => {
            if (result) {
              location.reload();
            }
          });
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

    if (!formValue.name || !formValue.shape || !formValue.fromDate || !formValue.toDate || !formValue.description || !formValue.dose || !formValue.timing) {
      Swal.fire('Error!', 'Please fill all the required fields.', 'error');
      return;
    }
    const updatedMedicine = {
      id: this.selectedElement.id,
      name: formValue.name,
      shape: formValue.shape,
      frequency: formValue.frequency,
      fromDate: formValue.fromDate,
      toDate: formValue.toDate,
      description: formValue.description,
      dose: [formValue.dose],
      timing: [formValue.timing]
      // Include other properties as needed
    };
  
    if (this.selectedElement && this.selectedElement.id) {
      
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);
  
      const requestBody = {
        name: updatedMedicine.name,
        shape: updatedMedicine.shape,
        frequency: updatedMedicine.frequency,
        fromDate: updatedMedicine.fromDate,
        toDate: updatedMedicine.toDate,
        description: updatedMedicine.description,
        dose: updatedMedicine.dose,
        timing: updatedMedicine.timing,
        // Add other properties to update if needed
      };
  
      this.http.put(this.key.updateMyMedicine+`${this.selectedElement.id}`, requestBody, { headers }).subscribe(
        response => {
          console.log('Medicine updated successfully:', response);
          Swal.fire({
            title: 'Updated!',
            text: 'Medicine updated successfully.',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
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
      // return `${year}-${month}-${day}`;
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
      // return `${year}-${month}-${day}`;
      return `${month}/${day}/${year}`;
    }
    return '';
  }

  formatTime(time: string): string {
    if (!time) {
      return '';
    }
  
    const formattedTime = moment(time, 'h:mm A').format('HH:mm');
    return formattedTime;
  }
  
  
}
