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
          if (resp.user.profile==null){
            const defaultimg = '/assets/img/profile.png';
            localStorage.setItem('profileimg',defaultimg)
          }
          
          Swal.fire({
            icon: 'success',
            title: 'Successfully...',
            text: 'Log In Successfully.',
            showConfirmButton: true,
            timer: 5000,
          }).then((resp) => {
            if (resp) {

              const chooseAccount = localStorage.getItem('chooseAccount');
              if(chooseAccount == 'Doctor'){
                this.router.navigate(['/doctor-profile'])
                
              }
              else{
                this.router.navigate(['/home'])
                .then(() => {
                  location.reload();
                });
              }
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
