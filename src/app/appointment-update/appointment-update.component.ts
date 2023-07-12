import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import Swal from 'sweetalert2';
import { UserService } from '../servise/user.service';
import { KeyService } from '../servise/key.service';
import * as moment from 'moment';
import { AuthService } from '../servise/auth.service';

export interface Appointment {
  id: string;
  withWhome: string;
  reason: string;
  speciality: string;
  address: string;
  phoneNumber: string;
  time: string[];
  appointmentdate: string;

}

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrls: ['./appointment-update.component.css']
})

export class AppointmentUpdateComponent implements OnInit {
  appointment: Appointment = {
    id: '',
    withWhome: '',
    reason: '',
    speciality: '',
    phoneNumber: '',
    address: '',
    time: [],
    appointmentdate: '',
  };
  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    private key: KeyService,
    private authService: AuthService
  ) { }


ngOnInit() {
  this.callApi();
}


updateAppointmentData() {


  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get('id')
  const url = `http://192.168.1.11:8866/updateMyAppointment/${employeeId}`;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

  const updatedAppointmentData: Appointment = {
    id: this.appointment.id,
    withWhome: this.appointment.withWhome,
    speciality: this.appointment.speciality,
    reason: this.appointment.reason,
    phoneNumber: this.appointment.phoneNumber,
    address: this.appointment.address,
    time: this.appointment.time,
    appointmentdate: this.appointment.appointmentdate
  };

  this.http.put(url, updatedAppointmentData, { headers }).subscribe(
    () => {
      console.log('Data updated successfully!');
      Swal.fire({
        title: 'Updated!',
        text: 'Appointment updated successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000,
      }).then((result) => {
        if (result) {
          // location.reload();
          this.router.navigate(['/appointment-history'])
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


callApi() {
  const token = localStorage.getItem('token');

    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('id')
    // Set the token in the request headers    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    const updateUrl = `http://192.168.1.11:8866/getAppointmentById/${employeeId}`;
    // Fetch the team leads from the API endpoint
    this.http.get(updateUrl, { headers })
    .subscribe(
      (response: any) => {
        //this.profileDetails = response;
        // this.appointment.dose = response.dose;
        this.appointment.id = response.id;
        this.appointment.withWhome = response.withWhome;
        this.appointment.reason = response.reason;
        this.appointment.speciality = response.speciality;
        this.appointment.phoneNumber = response.phoneNumber;
        this.appointment.address = response.address;
        this.appointment.appointmentdate = response.appointmentdate;
        this.appointment.time = response.time;
        console.error('response=======>', response);
      },
    (error) => {
      console.error('An error occurred while calling the API:', error);
    }
  );
}
minDate(): string {
  return this.authService.setMinDate();
}

}