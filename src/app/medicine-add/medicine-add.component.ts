// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { UserService } from '../servise/user.service';
// import { DatePipe } from '@angular/common';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// interface Medicine {
//   name: string;
//   shape: string;
//   dose: string;
//   fromDate: string;
//   toDate: string;
//   timing: string[];
//   description: string;
//   frequency: string;
// }

// @Component({
//   selector: 'app-medicine-add',
//   templateUrl: './medicine-add.component.html',
//   styleUrls: ['./medicine-add.component.css']
// })
// export class MedicineAddComponent implements OnInit {

  
//   medicines: { timing: string; dose: string}[] = [{ timing: '', dose: ''}];
//   timingsArray: string[] = [];
//   doseArray: string = '';
  

//   medicine: Medicine = {
//     name: '',
//     shape: '',
//     fromDate: '',
//     toDate: '',
//     timing: [],
//     description: '',
//     frequency: '',
//     dose: '',
//   };
//   doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Generate dose options dynamically
//   firstFormGroup: FormGroup | any;
//   secondFormGroup: FormGroup | any;

//   constructor(
//     private userService: UserService,
//     private router: Router,
//     private datePipe: DatePipe,
//     private formBuilder: FormBuilder
//   ) {}

//   ngOnInit() {
//     this.firstFormGroup = this.formBuilder.group({
//       name: ['', Validators.required],
//       email: ['', Validators.required]
//     });
//   }

//   addMedicine() {
//     this.medicines.push({ timing: '', dose: '' });
//   }

//   removeMedicine(index: number) {
//     this.medicines.splice(index, 1);
//   }

//   onMedicine() {


//     // Perform any necessary action with the captured medicine details
//     console.log(this.medicine);

//     // Filter out empty strings from the timings array
//     this.medicine.timing = this.timingsArray.filter(timing => timing !== '');
//     this.medicine.dose = this.doseArray;
//     // this.medicine.dose = this.doseArray.filter(dose => dose !== '');


//     // Call the API to save the medicine details
//     this.userService.medicineAdd(this.medicine).subscribe(
//       (response: any) => {
//         // Registration successful, do something with the response
//         console.log('Add successful', response);
//         this.router.navigate(['/medicine-history']);
//         // Redirect to a success page or perform any other action
//       },
//       (error: any) => {
//         // Registration failed, handle the error
//         console.error('Error occurred during add', error);
//         if (error.status === 403) {
//           // Access forbidden
//           console.error('Access forbidden. Check permissions or authentication.');
//         } else {
//           // Other error occurred
//           console.error('An error occurred while adding the medicine.', error);
//         }
//         // Display an error message or perform any other action
//       }
//     );
//   }

//   formatfromDate(date: string | null): string {
//     if (date) {
//       const parsedDate = new Date(date);
//       const year = parsedDate.getFullYear();
//       const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
//       const day = ('0' + parsedDate.getDate()).slice(-2);
//       return `${year}-${month}-${day}`;
//     }
//     return '';
//   }

//   formattoDate(date: string | null): string {
//     if (date) {
//       const parsedDate = new Date(date);
//       const year = parsedDate.getFullYear();
//       const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
//       const day = ('0' + parsedDate.getDate()).slice(-2);
//       return `${year}-${month}-${day}`;
//     }
//     return '';
//   }


  
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../servise/auth.service';
import Swal from 'sweetalert2';

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
  selector: 'app-medicine-add',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})
export class MedicineAddComponent implements OnInit {



  
  
  medicines: { timing: string; dose: string }[] = [{ timing: '', dose: '' }];
  timingsArray: string[] = [];
  doseArray: string[] = [];
  

  medicine: Medicine = {
    name: '',
    shape: '',
    fromDate: '',
    toDate: '',
    timing: [],
    description: '',
    frequency: [],
    dose: [],
  };
  doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Generate dose options dynamically
  // firstFormGroup: FormGroup | any;
  // secondFormGroup: FormGroup | any;


  frequencyOptions = ['Everyday', 'Every X day', 'Every X day of week','Every X day of month'];
  selectedFrequency: string | any;
  everydayOptions= ['everyday'];
  intervalOptions= ['1', '2', '3', '4','5','6','7','8','9','10'];
  weekOptions = ['Mon', 'Tue', 'Wed','Thu','Fri','Sat','Sun'];
  monthOptions = ['1', '2', '3','4','5', '6', '7', '8','9','10','11','12','13','14','15', '16', '17', '18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
  
  // selectedInterval: string[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.firstFormGroup = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   email: ['', Validators.required]
    // });
    // this.medicine.frequency = this.selectedInterval;
  }


  addMedicine() {
    this.medicines.push({ timing: '', dose: '' });
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
  }

  

onMedicine() {
  // Perform any necessary action with the captured medicine details
  console.log(this.medicine);

  // Filter out empty strings from the timings array
  this.medicine.timing = this.timingsArray.filter(timing => timing !== '');

  // Convert the array of doses to a Set
  this.medicine.dose = Array.from(this.doseArray);

  // Call the API to save the medicine details
  this.userService.medicineAdd(this.medicine).subscribe(
    (response: any) => {
      // Registration successful, show success message
      Swal.fire({
        title: 'Success',
        text: 'Medicine added successfully',
        icon: 'success',
        showConfirmButton: false,
            timer: 2000,
      }).then((result) => {
        if (result) {
          this.router.navigate(['/medicine-history']);
          // Redirect to a success page or perform any other action
        }
      });
    },
    (error: any) => {
      // Registration failed, handle the error
      console.error('Error occurred during add', error);
      if (error.status === 403) {
        // Access forbidden
        console.error('Access forbidden. Check permissions or authentication.');
      } else {
        // Other error occurred
        console.error('An error occurred while adding the medicine.', error);
      }
      // Display an error message or perform any other action
    }
  );
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

