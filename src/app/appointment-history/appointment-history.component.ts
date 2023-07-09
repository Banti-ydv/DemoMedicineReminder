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


  updateAppointment(element: PeriodicElement): void {

    const formatDate = this.formatDate(element.appointmentdate);
    const formatTime = this.formatTime(element.time);
    const tableHtml =
      '<table>' +
      '<tr>' +
      '<td><label for="swal-input-withWhome" class="swal2-label">With Whom:</label></td>' +
      '<td>' + '<input id="swal-input-withWhome" class="swal2-input custom-width" value="' +
      element.withWhome +
      '">' + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><label for="swal-input-reason" class="swal2-label">Reason:</label></td>' +
      '<td>' + '<input type="text" id="swal-input-reason" class="swal2-input custom-width" value="' +
      element.reason +
      '">' + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><label for="swal-input-speciality" class="swal2-label">Speciality:</label></td>' +
      '<td>' + '<input type="text" id="swal-input-speciality" class="swal2-input custom-width" value="' +
      element.speciality +
      '">' + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><label for="swal-input-address" class="swal2-label">Address:</label></td>' +
      '<td>' + '<input type="text" id="swal-input-address" class="swal2-input custom-width" value="' +
      element.address +
      '">' + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><label for="swal-input-phoneNumber" class="swal2-label">Phone Number:</label></td>' +
      '<td>' + '<input type="text" id="swal-input-phoneNumber" class="swal2-input custom-width"  maxlength="10" minlength="10" value="' +
      element.phoneNumber +
      '">' + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><label for="swal-input-appointmentdate" class="swal2-label">Date:</label></td>' +
      '<td>' + '<input type="date" id="swal-input-appointmentdate" class="swal2-input custom-width" [min]="minDate()" value="' +
      formatDate +
      '">' + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><label for="swal-input-time" class="swal2-label">Time:</label></td>' +
      '<td>' + '<input type="time" id="swal-input-time" class="swal2-input custom-width" value="' +
      formatTime +
      '">' + '</td>' +
      '</tr>' +
      '</table>';
    Swal.fire({
      title: 'Update Appointment',
      html: tableHtml,
      didOpen: () => {
        const phoneNumberInput = document.getElementById('swal-input-phoneNumber') as HTMLInputElement;
      phoneNumberInput.addEventListener('input', () => {
        phoneNumberInput.value = phoneNumberInput.value.replace(/\D/g, '');
        phoneNumberInput.pattern = '[0-9]{10}';
        phoneNumberInput.addEventListener('input', () => {
          phoneNumberInput.setCustomValidity(phoneNumberInput.validity.patternMismatch ? 'Please enter a 10-digit number' : '');
        });
      });
        const appointmentDateInput = document.getElementById('swal-input-appointmentdate') as HTMLInputElement;
      const currentDate = new Date();
      const minDate = currentDate.toISOString().split('T')[0];
      appointmentDateInput.min = minDate;
      },
      
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
          address: addressValue,
          speciality: specialityValue

        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const phoneNumberInput = document.getElementById('swal-input-phoneNumber') as HTMLInputElement;
        const phoneNumber = phoneNumberInput.value.replace(/\D/g, ''); // Remove non-digit characters
  
        if (phoneNumber.length !== 10) {
          // Swal.fire('Error!', 'Please enter a 10-digit phone number.', 'error');
          Swal.fire({
            title: 'Error!',
            text: 'Please enter a 10-digit phone number.',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.updateAppointment(element); // Recursive call to reopen the Swal dialog
          });
          return;
        }
  
        // Proceed with the appointment update logic
      }
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { withWhome, reason, appointmentdate, phoneNumber, address, speciality, time } = formValues;

          
          if (!withWhome || !reason || !appointmentdate || !phoneNumber || !address || !speciality || !time) {
           
            Swal.fire({
              title: 'Error!',
              text: 'Please fill all the input fields.',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              this.updateAppointment(element); 
            });
            return;
          }
          

          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


          const updatedData: PeriodicElement = {
            ...element,
            withWhome: withWhome,
            reason: reason,
            time: time,
            appointmentdate: appointmentdate,
            phoneNumber: phoneNumber,
            address: address,
            speciality: speciality,
          };

          this.http.put(this.key.updateMyAppointment + `${element.id}`, updatedData, { headers }).subscribe(
            () => {
              console.log('Appointment updated successfully.');

              const updatedElements = this.dataSource.data.map((e) =>
                e.id === element.id ? updatedData : e
              );
              this.dataSource.data = updatedElements;
              Swal.fire({
                title: 'Success!',
                text: 'Appointment updated successfully.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
              });
            },
            (error) => {
              console.error('An error occurred while updating the Appointment:', error);
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating the Appointment.',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
              });
              
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
      // return `${month}/${day}/${year}`;
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