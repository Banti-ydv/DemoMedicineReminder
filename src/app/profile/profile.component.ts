import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../servise/auth.service';
import { UserService } from '../servise/user.service';
import { KeyService } from '../servise/key.service';


interface PeriodicElement {
  id: number;
  firstname: string;
  lastname: string;
  emailid: string;
  imageUrl?: string;
  
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: PeriodicElement | undefined;
  userPhoto: string | undefined;
  imageUrl: SafeUrl | undefined;
  updatedData: any;
  defaultImageUrl: string = 'assets/img/profile-img.png';
  
 
  


  constructor(private http: HttpClient, private router: Router,private sanitizer: DomSanitizer,private userService: UserService,private key : KeyService) { }

  // id: number | any;
  
  ngOnInit(): void {
    this.getUserDetails();
    this.getUserPhoto();
    
    this.getProfilePhotoFromLocalStorage();
  }
  


  getUserDetails(): void {
  
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


      this.http.get<PeriodicElement>(this.key.MyDetailes, { headers }).subscribe(
        (data) => {
          this.userData = data;

          if (!this.userData.imageUrl) {
            this.setDefaultImage();
          }
        },
        (error) => {
          console.error('Error retrieving user details:', error);
        }
      );
    }
  }

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
              this.router.navigate(['/login']);
            },
            (error) => {
              console.error('An error occurred while deleting user details:', error);
            }
          );
        }
      }
    });
  }

  setImageUrl(): void {
    if (this.userData?.imageUrl) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.userData.imageUrl);
    } else {
      this.setDefaultImage();
    }
  }


  setDefaultImage(): void {
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl);
  }

  // openUploadPopup(): void {
  //   Swal.fire({
  //     title: 'Upload Image',
  //     text: 'Select an image file to upload',
  //     input: 'file',
  //     inputAttributes: {
  //       accept: 'image/*'
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'Upload',
  //     cancelButtonText: 'Cancel',
  //     preConfirm: (file) => {
  //       return new Promise((resolve, reject) => {
  //         if (!file) {
  //           Swal.showValidationMessage('Please select an image file');
  //           reject('No image selected');
  //           return;
  //         }
  
      
  //         const token = localStorage.getItem('token');
  
  //         const formData = new FormData();
  //         formData.append('photo', file);
  
  //         const headers = new HttpHeaders()
  //           .set('Authorization', `Bearer ${token}`)
  //           .set('Secret-Key', this.key.SECRET_KEY);
  
  //         this.http.post(this.key.upload_photo, formData, { headers }).subscribe(
  //           (response) => {
  //             resolve(response);
  //             // console.log(response);
  //           },
  //           (error) => {
  //             reject(error);
  //           }
  //         );
  //       });
  //     }
  //   })
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         const uploadedFile: any = result.value;
  //         console.log('File uploaded successfully:', result);

  //         // Update profile photo in local storage
  //       const profilePhoto = uploadedFile.profilePhoto; // Replace 'profilePhoto' with the key used in the response
  //       localStorage.setItem('profilePhoto', profilePhoto);

  
  //         Swal.fire({
  //           title: 'Success',
  //           text: 'Profile photo uploaded successfully',
  //           icon: 'success',
  //           showConfirmButton: true,
  //           timer: 3000,
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             location.reload();
  //           }
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       if (error !== 'No image selected') {
  //         console.error('Upload error:', error);
  //         // location.reload();
  //       } else {
  //         // Retry selecting an image
  //         this.openUploadPopup();
  //       }
  //     });
  // }
 


  // openUploadPopup(): void {
  //   Swal.fire({
  //     title: 'Upload Image',
  //     text: 'Select an image file to upload',
  //     input: 'file',
  //     inputAttributes: {
  //       accept: 'image/*'
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'Upload',
  //     cancelButtonText: 'Cancel',
  //     preConfirm: (file) => {
  //       return new Promise((resolve, reject) => {
  //         if (!file) {
  //           Swal.showValidationMessage('Please select an image file');
  //           reject('No image selected');
  //           return;
  //         }
      
  //         const token = localStorage.getItem('token');
    
  //         const formData = new FormData();
  //         formData.append('photo', file);
    
  //         const headers = new HttpHeaders()
  //           .set('Authorization', `Bearer ${token}`)
  //           .set('Secret-Key', this.key.SECRET_KEY);
    
  //         this.http.post(this.key.upload_photo, formData, { headers }).subscribe(
  //           (response) => {
  //             resolve(response);
  //           },
  //           (error) => {
  //             reject(error);
  //           }
  //         );
  //       });
  //     }
  //   })
  //   .then((result) => {
  //     if (result.isConfirmed) {
  //       const uploadedFile: any = result.value;
  //       console.log('File uploaded successfully:', result);
  
  //       // Remove the existing profile photo from local storage
  //       localStorage.removeItem('profilePhoto');
  
  //       // Update profile photo in local storage with the new image path
  //       const profilePhoto = uploadedFile.profilePhoto; // Replace 'profilePhoto' with the key used in the response
  //       localStorage.setItem('profilePhoto', profilePhoto);
  
  //       Swal.fire({
  //         title: 'Success',
  //         text: 'Profile photo uploaded successfully',
  //         icon: 'success',
  //         showConfirmButton: false,
  //         timer: 3000,
  //       }).then((result) => {
  //         if (result) {
  //           location.reload();
  //         }
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     if (error !== 'No image selected') {
  //       const uploadedFile: any = error.value;
  //       console.error('Upload error:', error.value);
        
  //       // Remove the existing profile photo from local storage
  //       localStorage.removeItem('profilePhoto');

  
  //       // Update profile photo in local storage with the new image path
  //       const profilePhoto = uploadedFile.profilePhoto; // Replace 'profilePhoto' with the key used in the response
  //       localStorage.setItem('profilePhoto', profilePhoto);
        
  //       Swal.fire({
  //         title: 'Opps....',
  //         text: 'Profile photo not upload.',
  //         icon: 'error',
  //         showConfirmButton: false,
  //         timer: 3000,
  //       }).then((error) => {
  //         if (error) {
  //           location.reload();
  //         }
  //       });
        
  //     } else {
  //       // Retry selecting an image
  //       this.openUploadPopup();
  //     }
  //   });
  // }
  

  openUploadPopup(): void {
    Swal.fire({
      title: 'Upload Image',
      text: 'Select an image file to upload',
      input: 'file',
      inputAttributes: {
        accept: 'image/*'
      },
      showCancelButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      preConfirm: (file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            Swal.showValidationMessage('Please select an image file');
            reject('No image selected');
            return;
          }
  
          const token = localStorage.getItem('token');
          const formData = new FormData();
          formData.append('photo', file, file.name); // Append the file with the correct field name
          
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Secret-Key', this.key.SECRET_KEY);
  
          this.http.post(this.key.upload_photo, formData, { headers }).subscribe(
            (response) => {
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
    })
    .then((result) => {
      if (result.isConfirmed) {
        const uploadedFile: any = result.value;
        console.log('File uploaded successfully:', result);
  
        if (uploadedFile && uploadedFile.profilePhoto) {
          // Remove the existing profile photo from local storage
          localStorage.removeItem('profilePhoto');
  
          // Update profile photo in local storage with the new image path
          const profilePhoto = uploadedFile.profilePhoto; // Replace 'profilePhoto' with the key used in the response
          localStorage.setItem('profilePhoto', profilePhoto);
  
          Swal.fire({
            title: 'Success',
            text: 'Profile photo uploaded successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            location.reload();
          });
        } else {
          console.error('Profile photo not found in the server response');
        }
      }
    })
    .catch((error) => {
      if (error !== 'No image selected') {
        console.error('Upload error:', error);
  
        // Handle the error response appropriately
        Swal.fire({
          title: 'Oops...',
          text: 'Profile photo not uploaded',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          // location.reload();
        });
      } else {
        // Retry selecting an image
        this.openUploadPopup();
      }
    });
  }
  

  getProfilePhotoFromLocalStorage(): string {
    return localStorage.getItem('profilePhoto') || '';
  }
  
getUserPhoto(): void {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


  this.http.get(this.key.current_photo, { headers, responseType: 'blob' }).subscribe(
    (response: Blob) => {
      const objectURL = URL.createObjectURL(response);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    },
    (error) => {
      console.error('API error:', error);
      // Handle the error here
    }
  );
}
openUpDatePopUp(): void {
  const token = localStorage.getItem('token');

  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


    this.http.get<PeriodicElement>(this.key.MyDetailes, { headers }).subscribe(
      (data) => {
        const element = {
          firstname: data.firstname,
          lastname: data.lastname,
          emailid: data.emailid
        };

        Swal.fire({
          title: 'Update Profile',
          html: 
          '<label for="swal-input-firstname" class="swal2-label">First Name:</label>' +
          '<input type="text" id="swal-input-firstname" class="swal2-input custom-width" value="' +
          element.firstname +
          '"><br>' +
          '<label for="swal-input-lastname" class="swal2-label">Last Name:</label>' +
          '<input id="swal-input-lastname" class="swal2-input custom-width" value="' +
          element.lastname +
          '"><br>' +
          '<label for="swal-input-emailid" class="swal2-label">Email Id:</label>' +
          '<input id="swal-input-emailid" class="swal2-input custom-width" value="' +
          element.emailid +
          '"><br>',
          showCancelButton: true,
          confirmButtonText: 'Update',
          cancelButtonText: 'Cancel',
          preConfirm: () => {
            const firstnameValue = (<HTMLInputElement>document.getElementById('swal-input-firstname')).value;
            const lastnameValue = (<HTMLInputElement>document.getElementById('swal-input-lastname')).value;
            const emailidValue = (<HTMLInputElement>document.getElementById('swal-input-emailid')).value;

            return {
              firstname: firstnameValue,
              lastname: lastnameValue,
              emailid: emailidValue,
            };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.updateProfile(result.value);
          }
        });
      },
      (error) => {
        console.error('Error retrieving user details:', error);
      }
    );
  }
}




updateProfile(updatedData: any): void {
  const token = localStorage.getItem('token');

  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    this.http.put(this.key.updateMydetailes, updatedData, { headers }).subscribe(
      (data: any) => {
        const element = {
          firstname: data.firstname,
          lastname: data.lastname,
          emailid: data.emailid
        };

        Swal.fire({
          title: 'Success',
          text: 'User details updated successfully',
          icon: 'success',
          showConfirmButton: true,
            timer: 3000,
        }).then((result) => {
          if (result.isConfirmed) {
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


