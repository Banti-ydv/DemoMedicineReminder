import { Component } from '@angular/core';
import { AuthService } from 'src/app/servise/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  logIn: { username: string, password: string } = { username: '', password: '' };
  showPassword: boolean = false;

  togglePasswordVisibility(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showPassword = target.checked;
  }

  hide = true;
  login = {
    username:'',
    password:''
  }
  
  constructor(private authServise: AuthService, private router: Router) { }

    onlogin() {
      if (this.login.username && this.login.password) {
        this.authServise.logIn(this.login.username, this.login.password).subscribe(
          (resp: any) => {
            console.log(resp); // Check the response structure and status code
            localStorage.setItem('token', resp.token);
            Swal.fire({
              icon: 'success',
              title: 'Successfully...',
              text: 'Log In Successfully.',
            });
            location.reload();
            this.router.navigate(['/home']);
            
          },
          (err) => {
            console.log(err)
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid credentials. Please try again.',
              });
              
           
          }
        );
      }
    }
     
  }
