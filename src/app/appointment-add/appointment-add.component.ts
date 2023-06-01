import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styleUrls: ['./appointment-add.component.css']
})
export class AppointmentAddComponent {

appointment = {
  appointmentdate:'',
  withWhome:'',
  time:''
  }

  constructor(private userService: UserService, private router: Router, private datePipe: DatePipe) { }

  onappointment() {  // Update the method name to match the one used in the template
    this.userService.appointmentAdd(this.appointment).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Add successful', response);
        // Redirect to a success page or perform any other action
        this.router.navigate(['/appointment-history']);

      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during add', error);
        // Display an error message or perform any other action
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
  

}
