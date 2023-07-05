// import { Component } from '@angular/core';
// import { CalendarView, CalendarEvent } from 'angular-calendar';
// import { AuthService } from '../servise/auth.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent {

//   selectedDate: Date | null = null;

//   constructor(public authService : AuthService) { }

// }

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

export interface PeriodicElement1 {
  exercisename: string;
  exercisetime: string;


}
export interface PeriodicElement2 {
  withWhome: string;
  time: string;
  appointmentdate: string;


}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // displayedColumns: string[] = ['position', 'exercisename', 'exercisetime', 'edit', 'delete'];
  dataSource1 = new MatTableDataSource<PeriodicElement1>();
  dataSource2 = new MatTableDataSource<PeriodicElement2>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService: UserService,
    public key: KeyService,
    public authService: AuthService
  ) { }



  ngOnInit() {
    this.callApi();
    this.callAppointment();
  }




  callApi() {
    const token = localStorage.getItem('token'); // Replace with your actual token

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElement1[]>(this.key.myExercise, { headers }).subscribe(
      (data: PeriodicElement1[]) => {
        this.dataSource1.data = data;
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


    this.http.get<PeriodicElement2[]>(this.key.myAppointment, { headers }).subscribe(
      (data: PeriodicElement2[]) => {
        this.dataSource2.data = data;

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


// import { Component, OnInit } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';


// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
//   animations: [
//     trigger('upDownAnimation', [
//       transition(':enter', [
//         style({ transform: 'translateY(-50%)', opacity: 0 }),
//         animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
//       ])
//     ])
//   ]
// })
// export class HomeComponent implements OnInit {
//   // Component logic goes here

//   ngOnInit() {
//     // Initialization logic goes here
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
//   animations: [
//     trigger('upDownAnimation', [
//       transition(':enter', [
//         style({ transform: 'translateY(-50%)', opacity: 0 }),
//         animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
//       ])
//     ])
//   ]
// })
// export class HomeComponent implements OnInit {
//   // Component logic goes here

//   ngOnInit() {
//     // Initialization logic goes here
//   }
// }
