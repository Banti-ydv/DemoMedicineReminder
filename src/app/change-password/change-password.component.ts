import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordForm: any;
  leaveForm: any;
  
constructor(private http:HttpClient,private router: Router){}
  changePassword() {
    // Get the token from wherever it is stored (e.g., local storage, a service)
    const token = localStorage.getItem('jwtToken');
    console.log('Token:', token);
    // Create the request headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Create the request body with the form values
    const requestBody = {
      oldPassword: this.passwordForm.get('oldPassword').value,
      newPassword: this.passwordForm.get('newPassword').value,
      confirmPassword: this.passwordForm.get('confirmPassword').value
    };

    // Send the API request
    this.http.put('http://192.168.1.11:8866/change-password', requestBody, { headers }).subscribe(
      () => {



        console.log('Success!'); // Print success message in the console
        Swal.fire({
          title: 'Changed',
          text: 'Password changed successfully'
        }).then(() => {
          // Redirect based on user role
          this.router.navigate(['/login']);
          location.reload();
        });

      },
      (error: any) => {
        if (error.status === 400) {
          Swal.fire({
            title: 'Error',
            text: 'Old password is incorrect'
          })
        }
        // Handle the error response
        console.error('API error:', error);
        // Additional error handling...
      }
    );

  }
  closeForm() {
    this.leaveForm.reset(); // Reset the form and clear the input fields
  }
}
