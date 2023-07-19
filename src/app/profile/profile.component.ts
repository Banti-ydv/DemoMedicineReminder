import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../servise/auth.service';
import { UserService } from '../servise/user.service';
import { KeyService } from '../servise/key.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

interface PeriodicElement {
  
  firstname: string;
  lastname: string;
  emailid: string;


}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: PeriodicElement | any;
  userPhoto: string | undefined;
  imageUrl: SafeUrl | any;
  // updatedData: PeriodicElement = { firstname: '', lastname: '', emailid: '' };


 






  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private key: KeyService,
    // private snackBar: MatSnackBar
  ) { }

  // id: number | any;

  ngOnInit(): void {
    this.getUserDetails();
    this.getUserPhoto();
  }

  isResponseSizeZero(): boolean {
    const responseSize = parseInt(localStorage.getItem('responseSize') || '0', 10);
    return responseSize === 0;
  }

  profilePhotoDelete() {
    const deleteUrl = 'http://192.168.1.11:8866/photo/delete';
 const token = localStorage.getItem('token');
  console.log('Upload:', token);

  // Set the token in the request headers
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    this.http.delete(deleteUrl, {headers})
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Delete Successful',
            text: 'Profile photo delete successfully.',
            showConfirmButton: false,
              timer: 3000,
          }).then((result) => {
            if (result) {
  
              console.log('result====>',result);
              this.router.navigate(['/profile'])
              .then(() => {
                location.reload();
              });
            }
          });
          // Handle successful deletion
          console.log('Profile photo deleted successfully:', response);
        
        },
        (error) => {
          // Handle error
          
          console.error('Error deleting profile photo:', error);
        }
      );
  }
  
// API for upload image start
handleFileInput(event: any) {
  const token = localStorage.getItem('token');
  console.log('Upload:', token);

  // Set the token in the request headers
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

  const file: File = event.target.files[0];
  const formData: FormData = new FormData();
  formData.append('photo', file);

  this.http.post('http://192.168.1.11:8866/upload-photo', formData, { headers }).subscribe(response => {
    // Handle the response from the server after image upload
    console.log(response);
    
  }, (error) => {
    console.error('API error:', error);
    // Handle the error here
    location.reload()
  }
  );
}
// API for upload image end

getUserDetails(): void {
  const token = localStorage.getItem('token');

  if (token) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Secret-Key', this.key.SECRET_KEY);

    this.http.get<PeriodicElement>(this.key.MyDetailes, { headers }).subscribe(
      (data) => {
        this.userData = data;
        this.populateFormFields();
      }
    );
  }
}

populateFormFields(): void {
  // Update the form fields with the fetched data
  const firstNameInput = document.getElementById('firstname') as HTMLInputElement;
  const lastNameInput = document.getElementById('lastname') as HTMLInputElement;
  const emailIdInput = document.getElementById('emailid') as HTMLInputElement;

  if (firstNameInput && lastNameInput && emailIdInput) {
    firstNameInput.value = this.userData.firstname;
    lastNameInput.value = this.userData.lastname;
    emailIdInput.value = this.userData.emailid;
  }
}

  // getUserDetails(): void {

  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


  //     this.http.get<PeriodicElement>(this.key.MyDetailes, { headers }).subscribe(
  //       (data) => {
  //         this.userData = data;

  //       }
  //     );
  //   }
  // }

  deleteProfile(): void {
    Swal.fire({
      title: 'Delete Profile',
      text: 'Are you sure you want to delete your profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');

        if (token) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


          this.http.delete(this.key.deleteMydetail, { headers }).subscribe(
            () => {
              console.log('User details deleted successfully.');
              // this.userData = undefined;
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
            },
            (error) => {
              console.error('An error occurred while deleting user details:', error);
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
            }
          );
        }
      }
    });
  }

  getUserPhoto(): void {
    const apiUrl = 'http://192.168.1.11:8866/photo/current';
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get(apiUrl, { headers, responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const objectURL = URL.createObjectURL(response);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        const responseSize = response.size;
        console.warn(responseSize);
        localStorage.setItem('responseSize', responseSize.toString());

      },
      (error) => {
        console.error('API error:', error);
        // Handle the error here
      }
    );
  }


  // openUpDatePopUp(): void {
  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

  //     this.http.get<PeriodicElement>(this.key.MyDetailes, { headers }).subscribe(
  //       (data) => {
  //         const element = {
  //           firstname: data.firstname,
  //           lastname: data.lastname,
  //           emailid: data.emailid
  //         };

  //         const swalConfig = {
  //           title: 'Update Profile',
  //           html:
  //             '<label for="swal-input-firstname" class="swal2-label">First Name:</label>' +
  //             '<input type="text" id="swal-input-firstname" class="swal2-input custom-width" value="' +
  //             element.firstname +
  //             '"><br>' +
  //             '<label for="swal-input-lastname" class="swal2-label">Last Name:</label>' +
  //             '<input id="swal-input-lastname" class="swal2-input custom-width" value="' +
  //             element.lastname +
  //             '"><br>' +
  //             '<label for="swal-input-emailid" class="swal2-label">Email Id:</label>' +
  //             '<input id="swal-input-emailid" class="swal2-input custom-width" value="' +
  //             element.emailid +
  //             '"><br>',
  //           showCancelButton: true,
  //           confirmButtonText: 'Update',
  //           cancelButtonText: 'Cancel',
  //           preConfirm: () => {
  //             const firstnameValue = (<HTMLInputElement>document.getElementById('swal-input-firstname')).value;
  //             const lastnameValue = (<HTMLInputElement>document.getElementById('swal-input-lastname')).value;
  //             const emailidValue = (<HTMLInputElement>document.getElementById('swal-input-emailid')).value;

  //             return {
  //               firstname: firstnameValue,
  //               lastname: lastnameValue,
  //               emailid: emailidValue,
  //             };
  //           },
  //         };

  //         Swal.fire(swalConfig).then((result) => {
  //           if (result.isConfirmed) {
  //             const formValues = result.value;
  //             if (formValues) {
  //               const { firstname, lastname, emailid } = formValues;

  //               if (!firstname || !lastname || !emailid) {
  //                 Swal.fire({
  //                   title: 'Error!',
  //                   text: 'Please fill all the input fields.',
  //                   icon: 'error',
  //                   showConfirmButton: false,
  //                   timer: 2000,
  //                 }).then(() => {
  //                   this.openUpDatePopUp(); // Recursive call to reopen the Swal dialog
  //                 }); // Reopen the popup
  //                 return;
  //               }

  //               this.updateProfile(result.value);
  //             }
  //           }
  //         });
  //       },
  //       (error) => {
  //         console.error('Error retrieving user details:', error);
  //       }
  //     );
  //   }
  // }


  


  // updateProfile(updatedData: any): void {
  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

  //     this.http.put(this.key.updateMydetailes, updatedData, { headers }).subscribe(
  //       (data: any) => {
  //         const element = {
  //           firstname: data.firstname,
  //           lastname: data.lastname,
  //           emailid: data.emailid
  //         };

  //         Swal.fire({
  //           title: 'Success',
  //           text: 'User details updated successfully',
  //           icon: 'success',
  //           showConfirmButton: false,
  //           timer: 2000,
  //         }).then((result) => {
  //           if (result) {
  //             location.reload();
  //           }
  //         });
  //       },
  //       (error) => {
  //         console.error('An error occurred while updating user details:', error);
  //       }
  //     );
  //   }
  // }


  
  updateProfile(updatedData: PeriodicElement): void {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);
     
      this.http.put(this.key.updateMydetailes, this.userData, { headers }).subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Success',
            text: 'User details updated successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          }).then((result) => {
            if (result) {
              location.reload();
            }
          });
        },
        (error) => {
          console.error('An error occurred while updating user details:', error);
        }
      );
    }
  }


}


