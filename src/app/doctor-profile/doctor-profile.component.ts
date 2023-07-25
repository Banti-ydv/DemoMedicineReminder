import { Component } from '@angular/core';
import { UserService } from '../servise/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent {


  doctorProfile = {
    name:"",
    emailid :"",
    mobileNumber :"",
    specilization :"",
    qualification :"",
    experiance :"",
    appointmentFees :"",
    availableTime :"",
    registrationDate :"",
    hospital :"",
    address :"",
    appointmentNumberPerDay :"",
  }

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onDoctorProfile() {
    this.userService.doctorProfile(this.doctorProfile).subscribe(
      (response: any) => {
        console.log('response =======>', response);
        Swal.fire({
          icon: 'success',
          title: 'Successful',
          text: 'User added successfully.',
          showConfirmButton: false,
            timer: 3000,
        }).then((result) => {
          if (result) {

            console.log('result====>',result);
            this.router.navigate(['/home'])
            // .then(() => {
            //   location.reload();
            // });
          }
        });
      },
      (error: any) => {
        console.log('error ===>', error);
        if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Api Error',
            showConfirmButton: false,
            timer: 3000,
          });
        } else if (error.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Service is currently offline. Please try again later.',
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'An error occurred during Added.',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    );
  }

}
