import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent} from './navbar/navbar.component'
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MedicineAddComponent } from './medicine-add/medicine-add.component';
import { ExerciseAddComponent } from './exercise-add/exercise-add.component';
import { FoodAddComponent } from './food-add/food-add.component';
import { AppointmentAddComponent } from './appointment-add/appointment-add.component';
import { MedicineHistoryComponent } from './medicine-history/medicine-history.component';
import { ExerciseHistoryComponent } from './exercise-history/exercise-history.component';
import { FoodHistoryComponent } from './food-history/food-history.component';
import { AppointmentHistoryComponent } from './appointment-history/appointment-history.component';
import { ProfileComponent } from './profile/profile.component';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';
import { MedicineUpdateComponent } from './medicine-update/medicine-update.component';
import { AppointmentUpdateComponent } from './appointment-update/appointment-update.component';
import { ExerciseUpdateComponent } from './exercise-update/exercise-update.component';
import { ChangepasswordComponent } from './change-password/change-password.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { AllAppointmentComponent } from './all-appointment/all-appointment.component';
// import { AuthGuard } from './servise/auth.guard';
// import { NavbarComponent } from './navbar/navbar.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent},
  { path: 'new-appointment', component: NewAppointmentComponent},
  { path: 'all-appointment', component: AllAppointmentComponent},
  { path: 'doctor-profile', component: DoctorProfileComponent},
  { path: 'about-us', component: AboutUsComponent},
  { path: 'medicine-add', component: MedicineAddComponent },
  { path: 'medicine-details', component: MedicineDetailsComponent },
  { path: 'medicine-history', component: MedicineHistoryComponent },
  { path: 'medicine-update', component: MedicineUpdateComponent },
  { path: 'exercise-add', component: ExerciseAddComponent },
  { path: 'exercise-history', component: ExerciseHistoryComponent },
  { path: 'exercise-update', component: ExerciseUpdateComponent },
  { path: 'food-add', component: FoodAddComponent },
  { path: 'food-history', component: FoodHistoryComponent },
  { path: 'appointment-add', component: AppointmentAddComponent },
  { path: 'appointment-history', component: AppointmentHistoryComponent },
  { path: 'appointment-update', component: AppointmentUpdateComponent },
  { path: "login", component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'navbar', component: NavbarComponent}, 
  { path: 'profile', component: ProfileComponent}, 
  { path: 'change-password', component: ChangepasswordComponent}, 
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
