import { Component } from '@angular/core';
import { AuthService } from 'src/app/servise/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { KeyService } from '../servise/key.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  logIn: { username: string, password: string } = { username: '', password: '' };
  showPassword: boolean = false;
  user: any;

  togglePasswordVisibility(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showPassword = target.checked;
  }

  hide = true;
  login = {
    username: '',
    password: ''
  }

  constructor(private authServise: AuthService, private router: Router, private Key: KeyService) { }
  onlogin() {
    if (this.login.username && this.login.password) {
      this.authServise.logIn(this.login.username, this.login.password).subscribe(
        (resp: any) => {
          console.log(resp); // Check the response structure and status code
          localStorage.setItem('token', resp.token);
          if (resp.user.profilePhoto === null ){
            localStorage.setItem('profilePhoto',this.Key.defaultImageUrl);
            console.log('if===>',resp);
          }
          else{
            localStorage.setItem('profilePhoto',resp.user.profilePhoto);
            console.error('else===>',resp)
          }

          Swal.fire({
            icon: 'success',
            title: 'Successfully...',
            text: 'Log In Successfully.',
            showConfirmButton: true,
            timer: 5000,
          }).then((result) => {
            if (result) {

              console.log('result====>',result);
              this.router.navigate(['/home'])
              .then(() => {
                location.reload();
              });
            }
          });
        },
        (err) => {
          if (err.status === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Service is currently offline. Please try again later.',
              showConfirmButton: false,
              timer: 5000,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Invalid credentials. Please try again.',
              showConfirmButton: false,
              timer: 5000,
            });

          }
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter your username and password.',
        showConfirmButton: false,
        timer: 5000,
      });
    }
  }


}
