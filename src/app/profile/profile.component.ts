import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../servise/auth.service';
import { UserService } from '../servise/user.service';

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
  imageUrl: SafeUrl | undefined;
  updatedData: any;
  defaultImageUrl: string = "assets/img/profile-img.png";
  logoutUrl = 'http://192.168.1.11:8866/signout';
 
  


  constructor(private http: HttpClient, private router: Router,private sanitizer: DomSanitizer,private userService: UserService) { }

  // id: number | any;
  
  ngOnInit(): void {
    this.getUserDetails();
    this.getUserPhoto();
    
  }
  


  getUserDetails(): void {
    const userDetailsUrl = 'http://192.168.1.11:8866/MyDetailes';
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


      this.http.get<PeriodicElement>(userDetailsUrl, { headers }).subscribe(
        (data) => {
          this.userData = data;
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
        const deleteUrl = 'http://192.168.1.11:8866/deleteMydetail';
        const token = localStorage.getItem('token');
  
        if (token) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);

  
          this.http.delete(deleteUrl, { headers }).subscribe(
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

  setDefaultImage(): void {
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl);
  }



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
  
          const apiUrl = 'http://192.168.1.11:8866/upload-photo';
          const token = localStorage.getItem('token');
  
          const formData = new FormData();
          formData.append('photo', file);
  
          const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Secret-Key', this.userService.SECRET_KEY);
  
          this.http.post(apiUrl, formData, { headers }).subscribe(
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
          this.openUploadPopup();
        }
      });
  }
  
  
getUserPhoto(): void {
  const apiUrl = 'http://192.168.1.11:8866/photo/current';
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


  this.http.get(apiUrl, { headers, responseType: 'blob' }).subscribe(
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
  const userDetailsUrl = 'http://192.168.1.11:8866/MyDetailes';
  const token = localStorage.getItem('token');

  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


    this.http.get<PeriodicElement>(userDetailsUrl, { headers }).subscribe(
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


updateProfile(updatedData:any): void {
  const updateUrl = 'http://192.168.1.11:8866/updateMydetailes';
  const token = localStorage.getItem('token');

  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);


    this.http.put(updateUrl, updatedData, { headers }).subscribe(
      (data: any) => {
        const element = {
          firstname: data.firstname,
          lastname: data.lastname,
          emailid: data.emailid
        };
        
        console.log('User details updated successfully.',data);
        location.reload();
      },
      (error) => {
        console.error('An error occurred while updating user details:', error);
      }
    );
  }
}


  }


