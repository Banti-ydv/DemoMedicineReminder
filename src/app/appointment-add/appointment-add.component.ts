import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../servise/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css']
})
export class AppointmentAddComponent {

  appointment: {
    withWhome: string;
    reason: string;
    speciality: string;
    phoneNumber: string;
    address: string;
    time: string;
    appointmentdate: string; // Corrected property name
    countryCode: string;
  } = {
    withWhome: '',
    reason: '',
    speciality: '',
    phoneNumber: '',
    address: '',
    time: '',
    appointmentdate: '',
    countryCode: '+91',
  };
  constructor(private userService: UserService, private router: Router, private datePipe: DatePipe,private authService: AuthService) { }



  onappointment() {
    this.userService.appointmentAdd(this.appointment).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Success',
          text: 'Appointment added successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        }).then((result) => {
          if (result) {
            this.router.navigate(['/appointment-history']);
          }
        });
      },
      (error: any) => {
        console.error('Error occurred during add', error);
      }
    );
  }
  
    formatDate(date: string | null): string {
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
