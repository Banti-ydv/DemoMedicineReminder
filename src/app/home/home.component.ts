import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NgConfirmService } from 'ng-confirm-box';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UserService } from '../servise/user.service';

import { KeyService } from '../servise/key.service';
import { AuthService } from '../servise/auth.service';
import * as moment from 'moment';


export interface PeriodicElementExercise {
  exercisename: string;
  exercisetime: string;


}
export interface PeriodicElementAppointment {
  withWhome: string;
  time: string;
  appointmentdate: string;


}
export interface PeriodicElementMedicien {
  name: string;
  timing: string;


}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  

  // displayedColumns: string[] = ['position', 'exercisename', 'exercisetime', 'edit', 'delete'];
  dataSourceExercise = new MatTableDataSource<PeriodicElementExercise>();
  dataSourceAppointment = new MatTableDataSource<PeriodicElementAppointment>();
  dataSourceMedicine = new MatTableDataSource<PeriodicElementMedicien>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    public key: KeyService,
    public authService: AuthService
  ) { }



  ngOnInit() {
    this.callExercise();
    this.callAppointment();
    this.callMedicine();
  }




  callExercise() {
    const token = localStorage.getItem('token'); // Replace with your actual token

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElementExercise[]>(this.key.myExercise, { headers }).subscribe(
      (data: PeriodicElementExercise[]) => {
        this.dataSourceExercise.data = data;
        console.error(data)

      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }


  callAppointment() {
    const token = localStorage.getItem('token');

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElementAppointment[]>(this.key.myAppointment, { headers }).subscribe(
      (data: PeriodicElementAppointment[]) => {
        this.dataSourceAppointment.data = data;

      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }

  callMedicine() {
    const token = localStorage.getItem('token');

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElementMedicien[]>(this.key.mymedicine, { headers }).subscribe(
      (data: PeriodicElementMedicien[]) => {
        this.dataSourceMedicine.data = data;

      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }

  exercise(){
    this.router.navigate(['/exercise-history']);
  }
  appointment(){
    this.router.navigate(['/appointment-history']);
  }

  formatTime(time: string): string {
    if (!time) {
      return '';
    }
  
    const formattedTime = moment(time, 'h:mm A').format('HH:mm');
    return formattedTime;
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
  

}
