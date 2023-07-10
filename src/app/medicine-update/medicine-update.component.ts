// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-medicine-update',
//   templateUrl: './medicine-update.component.html',
//   styleUrls: ['./medicine-update.component.css']
// })
// export class MedicineUpdateComponent {

// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../servise/auth.service';
import Swal from 'sweetalert2';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { KeyService } from '../servise/key.service';

export interface Medicine {
  id: string,
  name: string;
  shape: string;
  dose: number[];
  fromDate: string;
  toDate: string;
  timing: string[];
  frequency: string[];
}



@Component({
  selector: 'app-medicine-update',
  templateUrl: './medicine-update.component.html',
  styleUrls: ['./medicine-update.component.css']
})
export class MedicineUpdateComponent implements OnInit {




  selectedElement: any;
  medicines: { timing: string; dose: string }[] = [{ timing: '', dose: '' }];
  timingsArray: string[] = [];
  doseArray: string[] = [];


  medicine: Medicine = {
    id: '',
    name: '',
    shape: '',
    fromDate: '',
    toDate: '',
    timing: [],
    frequency: [],
    dose: [],
  };
  doseOptions: number[] = [0.5,1.0, 1.5, 2.0, 2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,8.5,9.0,9.5,10.0]; // Generate dose options dynamically


  dosedata: string[] | any;
  timedata: string[] | any;
  
  combinedData: { time: string, dose: number }[] = [];
  
  frequencyOptions = ['Everyday', 'Every X day', 'Every X day of week', 'Every X day of month'];
  selectedFrequency: string | any;
  everydayOptions = ['everyday'];
  intervalOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  weekOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    public key: KeyService
  ) { }

  ngOnInit() {
    this.userAllData();
    this.userTimeData();
  }


  addData() {
    this.timedata.push({ timing: '', dose: '' });
    
    
  }
  
  removeData(index: number) {
    this.timedata.splice(index, 1);
    this.dosedata.splice(index, 1);
   
  }
  
  getDayNumber(dayName: string): number {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek.indexOf(dayName);
  }

  calculateMinEndDate(): string {
    if (this.selectedFrequency === 'Every X day') {
      const fromDate = new Date(this.medicine.fromDate);
      const interval = parseInt(this.medicine.frequency[0], 10);
      const adjustedInterval = Math.max(interval + 1, 0);

      const minEndDate = new Date(fromDate.getTime() + adjustedInterval * 24 * 60 * 60 * 1000);
      return minEndDate.toISOString().substr(0, 10);
    }
    else if (this.selectedFrequency === 'Every X day of month') {
      const fromDate = new Date(this.medicine.fromDate);
      const lastIndex = this.medicine.frequency.length - 1;
      const interval = parseInt(this.medicine.frequency[lastIndex], 10);
      const adjustedInterval = Math.max(interval, 0);
      const startday = fromDate.getDate();
      if (startday < interval) {
        console.warn(startday);
        const minEndDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 0, interval + 1);
        console.log(minEndDate);
        return minEndDate.toISOString().substr(0, 10);
      }
      else {
        console.error(startday)
        const minEndDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, interval + 1);
        console.log(minEndDate);
        return minEndDate.toISOString().substr(0, 10);
      }
    }
    else if (this.selectedFrequency === 'Every X day of week') {
      const fromDate = new Date(this.medicine.fromDate);
      const selectedDayOfWeek = this.medicine.frequency[0];
      const nextDate = new Date(fromDate.getTime());
      while (nextDate.getDay() !== this.getDayNumber(selectedDayOfWeek)) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      const minEndDate = nextDate.toISOString().substr(0, 10);
      return minEndDate;
    }
    return this.medicine.fromDate;
  }





  formatfromDate(date: string | any): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
      //return `${month}/${day}/${year}`;
    }
    return '';
  }

  formattoDate(date: string | any): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
      //return `${month}/${day}/${year}`;
    }
    return '';
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }


  minDate(): string {
    return this.authService.setMinDate();
  }

  updateMedicineData() {

    const timingsArray = Array.from(
      document.querySelectorAll('input[type="time"]')
    ).map((input) => (input as HTMLInputElement).value);
    const doseArray = Array.from(
      document.querySelectorAll('input[type="number"]')
    ).map((input) => parseFloat((input as HTMLInputElement).value));

    console.log('Timings:', timingsArray);
    console.log('Doses:', doseArray);
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    const url = `http://192.168.1.11:8866/updateMyMedicine/${employeeId}`;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updatedMedicineData: Medicine = {
      id: this.medicine.id,
      name: this.medicine.name,
      shape: this.medicine.shape,
      fromDate: this.medicine.fromDate,
      toDate: this.medicine.toDate,
      frequency: this.medicine.frequency,
      dose: doseArray,
      timing: timingsArray,
    };

    this.http.put(url, updatedMedicineData, { headers }).subscribe(
      () => {
        console.log('Data updated successfully!');
        Swal.fire({
          title: 'Updated!',
          text: 'Medicine updated successfully.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result) {
            // location.reload();
            this.router.navigate(['/medicine-history'])
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


  userAllData(): void {
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
          //this.profileDetails = response;
          // this.medicine.dose = response.dose;
          this.medicine.id = response.id;
          this.medicine.frequency = response.frequency;
          this.medicine.fromDate = response.fromDate;
          this.medicine.toDate = response.toDate;
          this.medicine.name = response.name;
          this.medicine.shape = response.shape;
          this.dosedata = response.dose;
          console.error('response=======>', response);

        },
        (error) => {
          console.error('Failed to fetch team leads:', error);
        }
      );

  }



  userTimeData(): void {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);
    const updateUrl = `http://192.168.1.11:8866/getDoseandTime/${employeeId}`;
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
}

