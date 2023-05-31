import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
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

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, withWhome: 'Hydrogen', appointmentdate: '11/01/1018', time: '11:10 am'},
  {id: 2, withWhome: 'Helium', appointmentdate: '22/02/2028', time: '02:20 am'},
];


@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent {

  displayedColumns: string[] = ['position', 'withWhome', 'appointmentdate', 'time', 'edit', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router
    ) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteAppointment(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const apiUrl = `http://192.168.1.11:8866/deleteMyAppointment/${id}`;
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
    Swal.fire({
      title: 'Update Appointment',
      html:
        '<input id="swal-input-name" class="swal2-input" value="' +
        element.appointmentdate +
        '">' +
        '<input id="swal-input-shape" class="swal2-input" value="' +
        element.withWhome +
        '">' +
        '<input id="swal-input-description" class="swal2-input" value="' +
        element.time +
        '">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const nameValue = (<HTMLInputElement>document.getElementById('swal-input-name')).value;
        // const shapeValue = (<HTMLInputElement>document.getElementById('swal-input-shape')).value;
        // const doseValue = (<HTMLInputElement>document.getElementById('swal-input-dose')).value;
        const dateValue = (<HTMLInputElement>document.getElementById('swal-input-date')).value;
        const timeValue = (<HTMLInputElement>document.getElementById('swal-input-timing')).value;
        // const descriptionValue = (<HTMLInputElement>document.getElementById('swal-input-description')).value;
  
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
          const { withWhome, appointmentdate, time} = formValues;
  
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
}