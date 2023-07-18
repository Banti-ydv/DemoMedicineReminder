import { Component, ElementRef, OnInit } from '@angular/core';
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
  frequency: string | string[];
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
    frequency: '',
    dose: [],
  };
  // doseOptions: number[] = Array.from({ length: 10 }, (_, i) => i + 0.5); // Generate dose options dynamically
  doseOptions: number[] = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 8.5, 9.0, 9.5, 10.0]; // Generate dose options dynamically
  // firstFormGroup: FormGroup | any;
  // secondFormGroup: FormGroup | any;


  frequencyOptions = ['Everyday', 'Every X day', 'Every X day of week', 'Every X day of month'];
  selectedFrequency: string | any;
  everydayOptions = ['everyday'];
  intervalOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  weekOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  fromDateInput: any;
  toDateInput: any;
  divElement: any;

  // selectedInterval: string[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }


  ngOnInit() {
    
  }

  addMedicine() {
    this.medicines.push({ timing: '', dose: '' });
    this.timingsArray.push('');
    this.doseArray.push('');
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
    this.timingsArray.splice(index, 1);
    this.doseArray.splice(index, 1);
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


  clearFieldsToDate() {
    // this.medicine.fromDate = '';
    this.medicine.toDate = '';

    if (this.fromDateInput) {
      this.fromDateInput.nativeElement.value = '';
    }

    if (this.toDateInput) {
      this.toDateInput.nativeElement.value = '';
    }

    if (this.divElement) {
      this.divElement.nativeElement.innerHTML = '';
    }
  }
  clearFieldsFromDate() {
    this.medicine.fromDate = '';
    this.medicine.toDate = '';

    if (this.fromDateInput) {
      this.fromDateInput.nativeElement.value = '';
    }

    if (this.toDateInput) {
      this.toDateInput.nativeElement.value = '';
    }

    if (this.divElement) {
      this.divElement.nativeElement.innerHTML = '';
    }
  }
  clearFieldsFrequency() {
    this.selectedFrequency = '';

    if (this.fromDateInput) {
      this.fromDateInput.nativeElement.value = '';
    }

    if (this.toDateInput) {
      this.toDateInput.nativeElement.value = '';
    }

    if (this.divElement) {
      this.divElement.nativeElement.innerHTML = '';
    }
  }



  onMedicine() {
    // Perform any necessary action with the captured medicine details
    // console.log(this.medicine);
  // Set the frequency property based on selectedFrequency
  if (this.selectedFrequency === 'Everyday') {
    this.medicine.frequency = this.medicine.frequency as string; // This will be a single string
  } else {
    this.medicine.frequency = [this.medicine.frequency as string]; // Convert to an array with a single value
  }
    // Filter out empty strings from the timings array
    this.medicine.timing = this.timingsArray.filter(timing => timing !== '');
this.medicine.frequency = this.medicine.frequency;
    // Convert the array of doses to a Set
    this.medicine.dose = Array.from(this.doseArray);
    console.log("medicine frequency",this.medicine.frequency);
console.log(typeof(this.medicine.frequency))
console.log("medicine data",this.medicine)
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

