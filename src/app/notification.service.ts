// import { Injectable, InjectionToken, Inject } from '@angular/core';
// // import { AngularFireMessaging } from '@angular/fire/messaging';
// import { BehaviorSubject } from 'rxjs';


// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationService {
//   currentMessage = new BehaviorSubject(null);
//   angularFireMessaging: any;

//     constructor( ) {
//     this.angularFireMessaging.messages.subscribe(
//       (message:any) => {
//         if (message.notification) {
//           this.handleForegroundMessage(message);
//         } else {
//           this.handleBackgroundMessage(message);
//         }
//       },
//       (error:any) => {
//         console.error('Error receiving notification:', error);
//       }
//     );
//   }

//   private handleForegroundMessage(message: any): void {
//     console.log('Foreground message:', message);
//     this.currentMessage.next(message);
//   }

//   private handleBackgroundMessage(message: any): void {
//     console.log('Background message:', message);
//   }
// }


import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
// import { AngularFireMessaging } from '@angular/fire/messaging';

@Injectable()
export class NotificationService{

  currentMessage = new BehaviorSubject(null);

  // constructor(private angularFireMessaging:AngularFireMessaging) {
    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
// }

  requestPermission(){
  //   this.angularFireMessaging.requestToken.subscribe((token:any) => {
  //         console.log(token);
  //   },(err:any) => {
  //         console.log("Unable to get permission to notify..", err)
  //   });
  // }

  // receiveMessaging(){
  //   this.angularFireMessaging.messages.subscribe((payload:any) => {
  //         console.log("new message recieved", payload);
  // this.currentMessage.next(payload);
  //   })
  }
}