import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerIn: { password: string } = { password: '' };
  showPassword: boolean = false;

  passwordTouched: boolean = false;


  togglePasswordVisibility(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showPassword = target.checked;
  }


  register = {
    firstname: '',
    lastname: '',
    emailid: '',
    username: '',
    password: ''
  };

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onPasswordTouched() {
    this.passwordTouched = true;
  }


  onRegister() {
    this.userService.registerUser(this.register).subscribe(
      (response: any) => {
        console.log('response ===>', response);
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'User registered successfully.',
          showConfirmButton: false,
            timer: 3000,
        }).then((result) => {
          if (result) {

            console.log('result====>',result);
            this.router.navigate(['/login'])
            .then(() => {
              location.reload();
            });
          }
        });
      },
      (error: any) => {
        console.log('error ===>', error);
        if (error.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'User already exists. Please choose a different username.',
            showConfirmButton: false,
            timer: 3000,
          });
        } else if (error.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Service is currently offline. Please try again later.',
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'An error occurred during registration.',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    );
  }


  isPasswordInvalid(): boolean {
    const password = this.register.password;
    if (password.length < 8) {
      return true;
    }
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return true;
    }
    const lowercaseRegex = /[a-z]/;
    if (!lowercaseRegex.test(password)) {
      return true;
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharsRegex.test(password)) {
      return true;
    }
    return false;
  }

}
