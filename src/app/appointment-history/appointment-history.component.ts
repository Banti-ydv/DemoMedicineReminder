import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  id: number;
  withWhome: string;
  appointmentdate: string;
  time: string;

}



@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit {

  displayedColumns: string[] = ['id', 'withWhome', 'appointmentdate', 'time', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router
  ) { }


  ngOnInit() {
    this.callApi();
  }




  callApi() {
    const apiUrl = 'http://192.168.1.11:8866/myAppointment';
    const token = localStorage.getItem('token');

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

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
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.delete(apiUrl, { headers }).subscribe(
          () => {
            console.log('Appointment deleted successfully.');
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
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
        '<label for="swal-input-appointmentdate" class="swal2-label">Date:</label>' +
        '<input type="date" id="swal-input-appointmentdate" class="swal2-input custom-width" value="' +
        formattedDate +
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
        const dateValue = (<HTMLInputElement>document.getElementById('swal-input-appointmentdate')).value;
        const timeValue = (<HTMLInputElement>document.getElementById('swal-input-time')).value;


        return {
          withWhome: nameValue,
          appointmentdate: dateValue,
          time: timeValue,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { withWhome, appointmentdate, time } = formValues;

          const apiUrl = `http://192.168.1.11:8866/updateMyAppointment/${element.id}`;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

          const updatedData: PeriodicElement = {
            ...element,
            withWhome: withWhome,
            appointmentdate: appointmentdate,
            time: time,
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