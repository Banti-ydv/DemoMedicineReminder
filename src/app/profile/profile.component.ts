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


}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: PeriodicElement | undefined;
  userPhoto: string | undefined;
  imageUrl: SafeUrl | any;
  updatedData: any;






  constructor(
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private key: KeyService
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



  getUserDetails(): void {

    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);


      this.http.get<PeriodicElement>(this.key.MyDetailes, { headers }).subscribe(
        (data) => {
          this.userData = data;

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

  // setImageUrl(): void {
  //   if (this.userData?.imageUrl) {
  //     this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.userData.imageUrl);
  //   } }

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


  openPopupForImg(): void {
    Swal.fire({
      title: 'Upload Image',
      text: 'Select an image file to upload',
      input: 'file',
      inputAttributes: {
        accept: 'image/*'
      },
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      preConfirm: (file) => {
        return new Promise((resolve, reject) => {
          if (!file) {
            Swal.fire({
              title: 'Error!',
              text: 'Please select any file.',
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              this.openPopupForImg(); // Recursive call to reopen the Swal dialog
            });
          }

          // const apiUrl = 'http://192.168.1.11:8866/upload-photo';
          const token = localStorage.getItem('token');

          const formData = new FormData();
          formData.append('photo', file);

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
          const uploadedFile = result.value;
          console.log('File uploaded successfully:', uploadedFile);

          console.log('result:', result);

          // Reload the page
          location.reload();
        }
      })
      .catch((error) => {
        if (error !== 'No image selected') {
          console.error('Upload error:', error);
          location.reload();
        } else {
          // Retry selecting an image
          this.openPopupForImg();
        }
      });
  }


  // handleFileInput(event: any) {
  //   const token = localStorage.getItem('token');
  //   console.log('Upload:', token);

  //   // Set the token in the request headers
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);
  //   const file: File = event.target.files[0];
  //   const formData: FormData = new FormData();
  //   formData.append('photo', file);

  //   this.http.post('http://192.168.1.11:8866/upload-photo', formData, { headers }).subscribe(response => {
  //     // Handle the response from the server after image upload
  //     console.log(response);
  //     Swal.fire({
  //       title: 'Success!',
  //       text: 'Profile photo updated successfully.',
  //       icon: 'success',
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });

  //   }, (error) => {
  //     console.error('API error:', error);
  //     // Handle the error here
  //     Swal.fire({
  //       title: 'Success!',
  //       text: 'Profile photo updated successfully.',
  //       icon: 'success',
  //       showConfirmButton: false,
  //       timer: 2000,
  //     }).then(() => {
  //      location.reload();
  //     });
  //   }
  //   );
  // }

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

          const swalConfig = {
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
          };

          Swal.fire(swalConfig).then((result) => {
            if (result.isConfirmed) {
              const formValues = result.value;
              if (formValues) {
                const { firstname, lastname, emailid } = formValues;

                if (!firstname || !lastname || !emailid) {
                  Swal.fire({
                    title: 'Error!',
                    text: 'Please fill all the input fields.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000,
                  }).then(() => {
                    this.openUpDatePopUp(); // Recursive call to reopen the Swal dialog
                  }); // Reopen the popup
                  return;
                }

                this.updateProfile(result.value);
              }
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


