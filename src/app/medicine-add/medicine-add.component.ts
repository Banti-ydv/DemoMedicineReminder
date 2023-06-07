import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-medicine-add',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.css']
})
export class MedicineAddComponent implements OnInit {
  medicine = {
    name: '',
    shape: '',
    dose: '',
    fromDate: '',
    toDate: '',
    timing: '',
    description:''
  };

  firstFormGroup: FormGroup | any;
  secondFormGroup: FormGroup | any;


  hide = true; // Add the necessary property used in the template
  constructor(private userService: UserService, private router: Router, private datePipe: DatePipe,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required]
    });
  }


  onmedicine() {  // Update the method name to match the one used in the template
    this.userService.medicineAdd(this.medicine).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Add successful', response);
        this.router.navigate(['/medicine-history']);
        // Redirect to a success page or perform any other action
        // this.router.navigate(['/medicine-add']);

      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during add', error);
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
