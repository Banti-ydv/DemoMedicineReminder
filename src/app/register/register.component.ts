// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { UserService } from '../servise/user.service';
// import { NgToastService } from 'ng-angular-popup';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css'],
// })
// export class RegisterComponent{
//   hide = true;
//   register = {
//     firstname:'',
//     lastname:'',
//     emailid:'',
//     username:'',
//     password:''
//   }

//   constructor(private userService: UserService, private router: Router, private toast: NgToastService) { }




//   onregister() {
//     this.userService.registerUser(this.register).subscribe(
//       () => {
//         Swal.fire(
//           'Successful',
//           'Registration successful.',
//           'success'
//         ).then((result) => {
//           if (result.isConfirmed) {
//             this.router.navigate(['/login']);
//           }
//         });
//       },
//       (error: any) => {
//         let errorMessage = 'Error occurred during registration';
//         if (error.status === 409) {
//           errorMessage = 'User already exists. Please choose a different username.';
//         } else if (error.status === 500) {
//           errorMessage = 'Internal server error. Please try again later.';
//         }

//         Swal.fire(
//           'Registration Error',
//           errorMessage,
//           'error'
//         );
//       }
//     );
//   }  

// }





// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { UserService } from '../servise/user.service';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css'],
// })
// export class RegisterComponent {
//   hide = true;
//   register = {
//     firstname: '',
//     lastname: '',
//     emailid: '',
//     username: '',
//     password: ''
//   }

//   constructor(
//     private userService: UserService,
//     private router: Router
//   ) {}

//   onregister() {
//     this.userService.registerUser(this.register).subscribe(
//       (rep) => {
//         console.log(rep);
//         this.router.navigate(['/login']);
//       },
//       (error: any) => {
//         let errorMessage = 'Error occurred during registration';
//         console.log(error);
//         if (error.status === 400) {
//           errorMessage = 'User already exists. Please choose a different username.';
//         } else if (error.status === 500) {
//           errorMessage = 'Internal server error. Please try again later.';
//         }

//         alert(errorMessage); // Display the error message using the alert function
//       }
//     );
//   }
// }



import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerIn: { password: string } = { password: '' };
  showPassword: boolean = false;

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
  }

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  onRegister() {
    this.userService.registerUser(this.register).subscribe(
      (response: any) => {
        console.log('response ===>', response);
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.log('error ===>', error);
        if (error.status === 400) {
          alert('User already exists. Please choose a different username.');
        } else {
          alert('Error occurred during registration');
        } 
      }
    );
  }
}
