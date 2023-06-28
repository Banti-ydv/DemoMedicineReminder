import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './servise/user.service';
import { Router } from '@angular/router';

@Injectable()
export class PushNotificationService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging,private userService: UserService, public router : Router) {
    this.angularFireMessaging.messages.subscribe((messaging:any) => {
      messaging.onMessage((payload:any) => {
        console.log('Message received:', payload);
        this.currentMessage.next(payload);
      });

      messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken:any) => {
          console.log('Token refreshed:', refreshedToken);
        }).catch((error:any) => {
          console.error('Unable to retrieve refreshed token:', error);
        });
      });
    });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken
      .subscribe(
        (dtoken: any) => {
          console.log('Permission granted! Token:', dtoken);
        },
        (error: any) => {
          console.error('Permission denied:', error);
        }
      );
  }
  
  
}
