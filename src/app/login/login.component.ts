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


    onlogin(){
      // console.warn(data);
      // this.userService.login(data);

      if(this.login.username && this.login.password){
        this.userServise.generateToken(this.login.username, this.login.password).subscribe(
          (resp:any)=>{
            console.log(resp);
            localStorage.setItem("token",resp.token);
            
            this.router.navigate(['/home']);

            
          },
          err=>{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              // footer: '<a href="">Why do I have this issue?</a>'
            });
          }
        )
      }
      
    }

}
