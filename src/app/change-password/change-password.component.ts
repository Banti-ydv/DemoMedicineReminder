import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { KeyService } from '../servise/key.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangepasswordComponent {
  passwordForm: any;
  showPasswordOld: boolean | any;
  showPasswordNew: boolean | any;
  showPasswordConfirm: boolean | any;
  

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router,public key: KeyService) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  closeForm() {
    this.passwordForm.reset(); // Reset the form and clear the input fields
  }
  togglePasswordVisibilityOld(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showPasswordOld = target.checked;
  }
  togglePasswordVisibilityNew(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showPasswordNew = target.checked;
  }
  togglePasswordVisibilityConfirm(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showPasswordConfirm = target.checked;
  }


  onSubmit() {
    // Get the token from wherever it is stored (e.g., local storage, a service)
    const token = localStorage.getItem('token');
  console.log('Token:',token);
    // Create the request headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

  
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
          });
    
      },
      (error) => {
        // Handle the error response
        console.error('API error:', error);
        // Additional error handling...
      }
    );
    
  }
  
}
