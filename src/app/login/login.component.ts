import { Component } from '@angular/core';
import { UserService } from 'src/app/servise/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  login = {
    username:'',
    password:''
  }
  
  constructor(private userServise: UserService, private router: Router) { }

    onlogin() {
      if (this.login.username && this.login.password) {
        this.userServise.generateToken(this.login.username, this.login.password).subscribe(
          (resp: any) => {
            console.log(resp); // Check the response structure and status code
    
            if (resp && resp.status === 500 ) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid credentials. Please try again.',
              });
              
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Successful...',
                text: 'Login successful.',
              });
              localStorage.setItem('token', resp.token);
              this.router.navigate(['/profile']);
            }
          },
          (err) => {
            if (err && err.status === 500 ) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid credentials. Please try again.',
              });
              
            }
          }
        );
      }
    }
     
  }
