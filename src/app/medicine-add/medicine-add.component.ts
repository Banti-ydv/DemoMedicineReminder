import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Medicine {
  name: string;
  shape: string;
  dose: string;
  fromDate: string;
  toDate: string;
  timings: string[];
  description: string;
  frequency: string;
}

@Component({
  selector: 'app-medicine-add',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})
export class MedicineAddComponent implements OnInit {
  medicines: { timings: string; dose: string }[] = [{ timings: '', dose: '' }];
  timingsArray: string[] = [];

  medicine: Medicine = {
    name: '',
    shape: '',
    dose: '',
    fromDate: '',
    toDate: '',
    timings: [],
    description: '',
    frequency:''
  };

  firstFormGroup: FormGroup | any;
  secondFormGroup: FormGroup | any;

  constructor(
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  addMedicine() {
    this.medicines.push({ timings: '', dose: '' });
  }

  removeMedicine(index: number) {
    this.medicines.splice(index, 1);
  }

  onMedicine() {
    // Perform any necessary action with the captured medicine details
    console.log(this.medicine);

    // Filter out empty strings from the timings array
    this.medicine.timings = this.timingsArray.filter(timing => timing !== '');

    // Call the API to save the medicine details
    this.userService.medicineAdd(this.medicine).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Add successful', response);
        this.router.navigate(['/medicine-history']);
        // Redirect to a success page or perform any other action
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
}
