import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import Swal from 'sweetalert2';
import { UserService } from '../servise/user.service';

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

  displayedColumns: string[] = ['id', 'withWhome', 'reason', 'speciality','appointmentdate',  'time', 'phoneNumber', 'address', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private userService:UserService
  ) { }


  ngOnInit() {
    this.callApi();
  }




  callApi() {
    const apiUrl = 'http://192.168.1.11:8866/myAppointment';
    const token = localStorage.getItem('token');

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


    this.http.get<PeriodicElement[]>(apiUrl, { headers }).subscribe(
      (data: PeriodicElement[]) => {
        this.dataSource.data = data;

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
        const apiUrl = `http://192.168.1.11:8866/deleteMyAppointmnetdetail/${id}`;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


        this.http.delete(apiUrl, { headers }).subscribe(
          (reason) => {
            console.log('Appointment deleted successfully.' ,reason);
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
            location.reload();
          },
          (error) => {
            console.error('An error occurred while deleting the appointment:', error);
          }
        );
      }
    });
  }


  updateAppointment(element: PeriodicElement): void {

    const formattedDate = this.formatDate(element.appointmentdate);
    Swal.fire({
      title: 'Update Appointment',
      html:
        '<label for="swal-input-withWhome" class="swal2-label">With Whome:</label>' +
        '<input id="swal-input-withWhome" class="swal2-input custom-width" value="' +
        element.withWhome +
        '"><br>' +
        '<label for="swal-input-reason" class="swal2-label">Reason:</label>' +
        '<input type="text" id="swal-input-reason" class="swal2-input custom-width" value="' +
        element.reason +
        '"><br>' +
        '<label for="swal-input-speciality" class="swal2-label">Speciality:</label>' +
        '<input type="text" id="swal-input-speciality" class="swal2-input custom-width" value="' +
        element.speciality +
        '"><br>' +
        '<label for="swal-input-address" class="swal2-label">Address:</label>' +
        '<input type="text" id="swal-input-address" class="swal2-input custom-width" value="' +
        element.address +
        '"><br>' +
        '<label for="swal-input-phoneNumber" class="swal2-label">Phone Number:</label>' +
        '<input type="text" id="swal-input-phoneNumber" class="swal2-input custom-width" value="' +
        element.phoneNumber +
        '"><br>' +
        '<label for="swal-input-appointmentdate" class="swal2-label"> Date:</label>' +
        '<input type="text" id="swal-input-appointmentdate" class="swal2-input custom-width" value="' +
        formattedDate+
        '"><br>' +
        '<label for="swal-input-time" class="swal2-label">Time:</label>' +
        '<input type="time" id="swal-input-time" class="swal2-input custom-width" value="' +
        element.time +
        '"><br>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const nameValue = (<HTMLInputElement>document.getElementById('swal-input-withWhome')).value;
        const reasonValue = (<HTMLInputElement>document.getElementById('swal-input-reason')).value;
        const timeValue = (<HTMLInputElement>document.getElementById('swal-input-time')).value;
        const phoneNumberValue = (<HTMLInputElement>document.getElementById('swal-input-phoneNumber')).value;
        const addressValue = (<HTMLInputElement>document.getElementById('swal-input-address')).value;
        const specialityValue = (<HTMLInputElement>document.getElementById('swal-input-speciality')).value;
        const appointmentdateValue = (<HTMLInputElement>document.getElementById('swal-input-appointmentdate')).value;


        return {
          withWhome: nameValue,
          reason: reasonValue,
          time: timeValue,
          appointmentdate: appointmentdateValue,
          phoneNumber: phoneNumberValue,
          address : addressValue,
          speciality : specialityValue

        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { withWhome, reason,appointmentdate,phoneNumber,address,speciality, time } = formValues;

          const apiUrl = `http://192.168.1.11:8866/updateMyAppointment/${element.id}`;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


          const updatedData: PeriodicElement = {
            ...element,
            withWhome: withWhome,
            reason: reason,
            time: time,
            appointmentdate:appointmentdate,
            phoneNumber:phoneNumber,
            address:address,
            speciality:speciality,
          };

          this.http.put(apiUrl, updatedData, { headers }).subscribe(
            () => {
              console.log('Appointment updated successfully.');

              const updatedElements = this.dataSource.data.map((e) =>
                e.id === element.id ? updatedData : e
              );
              this.dataSource.data = updatedElements;
              Swal.fire('Success!', 'Appointment updated successfully.', 'success');
            },
            (error) => {
              console.error('An error occurred while updating the Appointment:', error);
              Swal.fire('Error!', 'An error occurred while updating the Appointment.', 'error');
            }
          );
        }
      }
    });
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