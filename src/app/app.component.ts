// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'medicine-app';
// }


import { Component } from '@angular/core';
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'medicine-app';
  message: any;
  constructor(private notificationService: NotificationService) {}
  


}
