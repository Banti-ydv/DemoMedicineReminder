import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MatCardModule } from '@angular/material/card';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';



import { NgIf , NgFor, AsyncPipe} from '@angular/common';
import { MedicineAddComponent } from './medicine-add/medicine-add.component';
import { ExerciseAddComponent } from './exercise-add/exercise-add.component';
import { FoodAddComponent } from './food-add/food-add.component';
import { AppointmentAddComponent } from './appointment-add/appointment-add.component';
import { MedicineHistoryComponent } from './medicine-history/medicine-history.component';
import { ExerciseHistoryComponent } from './exercise-history/exercise-history.component';
import { FoodHistoryComponent } from './food-history/food-history.component';
import { AppointmentHistoryComponent } from './appointment-history/appointment-history.component';
import { NgToastModule } from 'ng-angular-popup';
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule }from '@angular/material/dialog';
import { NgConfirmModule } from 'ng-confirm-box';

// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire'
// import { AngularFireMessagingModule } from '@angular/fire/messaging';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { AsyncPipe } from '@angular/common';
import { NotificationService } from './notification.service';
import { environment } from 'src/environments/environment';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MedicineAddComponent,
    ExerciseAddComponent,
    FoodAddComponent,
    AppointmentAddComponent,
    MedicineHistoryComponent,
    ExerciseHistoryComponent,
    FoodHistoryComponent,
    AppointmentHistoryComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgToastModule,
    NgIf,
    NgFor,
    MatTableModule,
    MatDialogModule,
    NgConfirmModule,
    MatDatepickerModule,
    MatNativeDateModule,

    // AngularFireAuthModule,
    // AngularFireMessagingModule,
    // AngularFireDatabaseModule,
    // AngularFireModule.initializeApp(environment.firebase)

    // AngularFireAuthModule,
   
  ],
  providers: [NotificationService, AsyncPipe ,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }


