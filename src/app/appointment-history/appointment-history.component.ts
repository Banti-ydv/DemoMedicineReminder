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

export interface PeriodicElement {
  id: number;
  withWhome: string;
  reason: string;
  speciality: string;
  address: string;
  phoneNumber: string;
  time: string;
  appointmentdate: string;

}



@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit {

  displayedColumns: string[] = ['id', 'withWhome', 'reason', 'speciality', 'appointmentdate', 'time', 'phoneNumber', 'address', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

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




  callApi() {
    const token = localStorage.getItem('token');

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElement[]>(this.key.myAppointment, { headers }).subscribe(
      (data: PeriodicElement[]) => {
        // Reverse the received array
        const reversedData = data.reverse();
  
        // Set the reversed array as the data source
        this.dataSource.data = reversedData;
      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteAppointment(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want delete this appointment ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


        this.http.delete(this.key.deleteMyAppointmnetdetail + `${id}`, { headers }).subscribe(
          (reason) => {
            console.log('Appointment deleted successfully.', reason);
            Swal.fire({
              title: 'Deleted!',
              text: 'Your appointment has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            }).then((result) => {
              if (result) {
                location.reload();
              }
            });
          },
          (error) => {
            console.error('An error occurred while deleting the appointment:', error);
          }
        );
      }
    });
  }


  formatDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      // return `${year}-${month}-${day}`;
      return `${month}/${day}/${year}`;
      
    }
    return '';
  }

  formatTime(time: string): string {
    if (!time) {
      return '';
    }
  
    const formattedTime = moment(time, 'h:mm A').format('HH:mm');
    return formattedTime;
  }
  


  minDate(): string {
    return this.authService.setMinDate();
  }

  

}