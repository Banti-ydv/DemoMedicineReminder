// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-medicine-details',
//   templateUrl: './medicine-details.component.html',
//   styleUrls: ['./medicine-details.component.css']
// })
// export class MedicineDetailsComponent {

// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../servise/auth.service';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeyService } from '../servise/key.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

export interface Medicine {
  name: string;
  shape: string;
  dose: string[];
  fromDate: string;
  toDate: string;
  timing: string[];
  description: string;
  frequency: string[];
}



@Component({
  selector: 'app-medicine-details',
  templateUrl: './medicine-details.component.html',
  styleUrls: ['./medicine-details.component.css']
})
export class MedicineDetailsComponent implements OnInit {

  items: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  dosedata: string[] | any;
  timedata: string[] | any;


  
  selectedElement: any;
  // updateMedicineForm: FormGroup;
  medicines: { timing: string; dose: string }[] = [{ timing: '', dose: '' }];
  profileDetails: any;
  
  // timingsArray: string[] = [];
  // doseArray: string[] = [];
  
  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http : HttpClient,
    public key : KeyService
  ) {}

  ngOnInit() {
    this.EmployeeProfile();
  }
  


  EmployeeProfile(): void{
    const token = localStorage.getItem('token');
   
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    // Set the token in the request headers    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updateUrl = `http://192.168.1.11:8866/getDoseandTime/${employeeId}`;
       // Fetch the team leads from the API endpoint
       this.http.get(updateUrl, { headers })
      
        .subscribe(
          
         (response: any) => {
          this.profileDetails = response;
          console.log(response);

          this.dosedata = response.dose;
          this.timedata = response.timing;
          console.error('dosedata=====>',this.dosedata)
          
         },
         (error) => {
           console.error('Failed to fetch team leads:', error);
         }
     );
     
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

 minDate(): string {
    return this.authService.setMinDate();
  }
  
}