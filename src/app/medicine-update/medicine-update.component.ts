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
  name: string;
  shape: string;
  dose: string[];
  fromDate: string;
  toDate: string;
  timing: string[];
  // description: string;
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
    name: '',
    shape: '',
    fromDate: '',
    toDate: '',
    timing: [],
    // description: '',
    frequency: [],
    dose: [],
    // description: ''
  };
  doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Generate dose options dynamically
  // firstFormGroup: FormGroup | any;
  // secondFormGroup: FormGroup | any;
  profileDetails: any;
  dosetime: string[] | any;
  profileDetails2: any;

  dosedata: string[] | any;
  timedata: string[] | any;

  frequencyOptions = ['Everyday', 'Every X day', 'Every X day of week', 'Every X day of month'];
  selectedFrequency: string | any;
  everydayOptions = ['everyday'];
  intervalOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  weekOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  monthOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  // selectedInterval: string[] = [];

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
    this.userData();
    this.EmployeeProfile2();
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

  updateMedicineData() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    const url = `http://192.168.1.11:8866/updateMyMedicine/${employeeId}`;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updatedMedicineData: Medicine = {
      name: this.medicine.name,
      shape: this.medicine.shape,
      fromDate: this.formatfromDate(this.medicine.fromDate),
      toDate: this.formattoDate(this.medicine.toDate),
      timing: this.timedata,
      // description: this.medicine.description,
      frequency: this.medicine.frequency,
      dose: this.medicines.map((medicine) => medicine.dose),
      // description: ''
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


  userData(): void {
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
          this.profileDetails = response;
          this.dosedata = response.dose;
          console.error('response=======>', response);

        },
        (error) => {
          console.error('Failed to fetch team leads:', error);
        }
      );

  }



  EmployeeProfile2(): void {
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
          this.profileDetails2 = response;
          console.log('2222222', response);


          this.dosetime = response;
          // this.dosedata = response.dose;

          console.error('dosetime=====>', this.dosetime)


        },
        (error) => {
          console.error('Failed to fetch team leads:', error);
        }
      );

  }


}

