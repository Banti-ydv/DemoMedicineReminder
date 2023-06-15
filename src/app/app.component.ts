import { Component, OnInit } from '@angular/core';
import 'firebase/compat/messaging';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './servise/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './servise/user.service';


interface PeriodicElement {
  id: number;
  firstname: string;
  lastname: string;
  emailid: string;
  
}



@Component({
  selector: 'medicine-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  userData: PeriodicElement | undefined;
  userPhoto: string | undefined;
  imageUrl: SafeUrl | undefined;
  updatedData: any;
  defaultImageUrl: string = "assets/img/profile-img.png";

  notificationMessages: any[] = [];
  

  title = 'af-notification';
  message: any = null;
  isLoggedIn!: boolean;
  
  constructor(public authService: AuthService,private router: Router,private sanitizer: DomSanitizer,private http: HttpClient,private userService: UserService) { }
  ngOnInit(): void {
//profile
     this.getUserDetails();
    this.getUserPhoto();

//logged in
    this.isLoggedIn = this.authService.getIsLoggedIn();
if (!this.isLoggedIn) {
  if (window.location.pathname !== '/home' && window.location.pathname !== '/register' && window.location.pathname !== '/contact') {
    this.router.navigate(['/login']);
  }
}
//message
    this.requestPermission();
    this.listen();
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            let myuuid = uuidv4();

            console.log('Your UUID is: ' + myuuid);
            console.log("Hurraaa!!! we got the token.....");
            console.log(currentToken);
            localStorage.setItem('deviceToken', currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;
      this.showNotification(payload);

    });
  }

  showNotification(payload: any) {
    const notificationOptions: NotificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon
    };
    const notification = new Notification(payload.notification.title, notificationOptions);

    notification.addEventListener('click', () => {
      // Handle notification click event
    });
  }


  logout() {
    // Call the logout() method from AuthService
    this.authService.logOut();
    // this.isLoggedIn = false;
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

  setDefaultImage(): void {
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.defaultImageUrl);
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

skipNotification(message: any) {
  // Perform skip action for the given message
  // You can remove the message from the notificationMessages array or update its status
}

takeAction(message: any) {
  // Perform action for the given message
  // You can update the message status or navigate to a specific page based on the action
}

// Method to handle incoming notification messages
handleNotification(message: any) {
  this.notificationMessages.push(message);
}







}

