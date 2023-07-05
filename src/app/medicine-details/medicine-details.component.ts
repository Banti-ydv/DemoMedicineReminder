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
import * as moment from 'moment';

export interface Medicine {
  id: string;
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

  // items: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  dosedata: string[] | any;
  timedata: string[] | any;
  // dosetime: string[] | any;


  
  selectedElement: any;
  // updateMedicineForm: FormGroup;
  medicines: { timing: string; dose: string }[] = [{ timing: '', dose: '' }];
  profileDetails1: any;
  profileDetails2: any;
    
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
    this.EmployeeProfile2();
    this.EmployeeProfile1();
  }
  


  EmployeeProfile1(): void{
    const token = localStorage.getItem('token');
   
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    // Set the token in the request headers    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updateUrl = `http://192.168.1.11:8866/getallData/${employeeId}`;
       // Fetch the team leads from the API endpoint
       this.http.get(updateUrl, { headers })
      
        .subscribe(
          
         (response: any) => {
          this.profileDetails1 = response;
          console.log(response);

          this.dosedata = response.dose;
          // this.timedata = response.timing;
          console.error('dosedata=====>',this.dosedata)
          // console.error('timedata=====>',this.timedata)
          
         },
         (error) => {
           console.error('Failed to fetch team leads:', error);
         }
     );
     
  }

  EmployeeProfile2(): void{
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
          
          this.timedata = response;
          
         },
         (error) => {
           console.error('Failed to fetch team leads:', error);
         }
     );
     
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
      // return `${month}/${day}/${year}`;
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
      // return `${month}/${day}/${year}`;
    }
    return '';
  }

 minDate(): string {
    return this.authService.setMinDate();
  }

  convertTo24HourFormat(timing: string): string {
    const formattedTime = moment(timing, 'h:mm A').format('HH:mm');
    return formattedTime;
  }
}