import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';


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

  constructor(private userService: UserService, private router: Router) { }

  onappointment() {  // Update the method name to match the one used in the template
    this.userService.appointmentAdd(this.appointment).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Add successful', response);
        // Redirect to a success page or perform any other action
        // this.router.navigate(['/medicine-add']);

      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during add', error);
        // Display an error message or perform any other action
      }
    );
  }

}
