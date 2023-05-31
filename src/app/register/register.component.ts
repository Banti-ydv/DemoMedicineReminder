import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent{
  hide = true;
  register = {
    firstname:'',
    lastname:'',
    emailid:'',
    username:'',
    password:''
  }
  
  constructor(private userService: UserService, private router: Router, private toast: NgToastService) { }

    
  onregister() {
    this.userService.registerUser(this.register).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Registration successful', response);
        // Redirect to a success page or perform any other action
        this.router.navigate(['/login']);
        this.toast.success({detail:"Success Message",summary:"Register Successfully.",duration:5000})
      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during registration', error);
        this.toast.error({detail:"Error Message",summary:"Something went wrong.",duration:5000})
        // Display an error message or perform any other action
      }
    );
  }
  
  
}
