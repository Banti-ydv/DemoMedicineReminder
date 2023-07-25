import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeyService } from './key.service';
import { Medicine } from '../medicine-update/medicine-update.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  updateMedicine(updatedMedicine: Medicine) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient, private router: Router,private key : KeyService ) { }


 

  registerUser(userData: any) {
    const registerUrl = `${this.key.register}`;
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'}).set('Secret-Key', this.key.SECRET_KEY);
    return this.http.post(registerUrl, userData, { headers });

          
  }


  doctorProfile(doctorProfile: any) {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    return this.http.post(this.key.doctorProfile, doctorProfile, { headers });
  }

  medicineAdd(medicineAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    return this.http.post(this.key.addmedicine, medicineAdd, { headers });
  }



  exerciseAdd(exerciseAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY).set('Content-Type', 'application/json');
    return this.http.post(this.key.addExercise, exerciseAdd, { headers });
  }

  foodAdd(foodAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    return this.http.post(this.key.saveFood, foodAdd, { headers });
  }

  appointmentAdd(appointmentAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);

    return this.http.post(this.key.takeAppointment, appointmentAdd, { headers });
  }


}
