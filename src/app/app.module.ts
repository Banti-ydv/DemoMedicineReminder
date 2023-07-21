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
import { ProfileComponent } from './profile/profile.component';
import { environment } from "../environments/environment";
import { initializeApp } from "firebase/app";
initializeApp(environment.firebase);
import { AngularFireModule } from '@angular/fire/compat';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from './servise/auth.service';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';
import { MedicineUpdateComponent } from './medicine-update/medicine-update.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppointmentUpdateComponent } from './appointment-update/appointment-update.component';
import { ExerciseUpdateComponent } from './exercise-update/exercise-update.component';
import { ChangepasswordComponent } from './change-password/change-password.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AboutUsComponent } from './about-us/about-us.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { AllAppointmentComponent } from './all-appointment/all-appointment.component';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ConfirmedValidatorTsComponent } from './change-password/confirmed.validator.ts/confirmed.validator.ts.component';



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
    ProfileComponent,
    MedicineDetailsComponent,
    MedicineUpdateComponent,
    AppointmentUpdateComponent,
    ExerciseUpdateComponent,
    ChangepasswordComponent,
    AboutUsComponent,
    DoctorProfileComponent,
    NewAppointmentComponent,
    AllAppointmentComponent,
    // ConfirmedValidatorTsComponent
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
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatAutocompleteModule,
    MatExpansionModule,
    // MatSnackBar

    
  ],
  providers: [ AsyncPipe ,DatePipe, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }


