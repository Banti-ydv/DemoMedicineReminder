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




const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent},
  { path: 'medicine-add', component: MedicineAddComponent },
  { path: 'medicine-history', component: MedicineHistoryComponent },
  { path: 'exercise-add', component: ExerciseAddComponent },
  { path: 'exercise-history', component: ExerciseHistoryComponent },
  { path: 'food-add', component: FoodAddComponent },
  { path: 'food-history', component: FoodHistoryComponent },
  { path: 'appointment-add', component: AppointmentAddComponent },
  { path: 'appointment-history', component: AppointmentHistoryComponent },
  { path: "login", component: LoginComponent, pathMatch:'full'},
  { path: 'register', component: RegisterComponent },
  { path: 'navbar', component: NavbarComponent}, 
  { path: 'profile', component: ProfileComponent}, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
