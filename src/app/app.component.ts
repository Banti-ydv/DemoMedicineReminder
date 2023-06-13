import { Component, OnInit } from '@angular/core';
import 'firebase/compat/messaging';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './servise/auth.service';
import { Router } from '@angular/router';

interface UserData {
  firstname: string;
  // other properties
}


@Component({
  selector: 'medicine-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'af-notification';
  message: any = null;
  isLoggedIn: boolean = false;
  userData: UserData | undefined;
  constructor(public authService: AuthService,private router: Router) { }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
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
}

