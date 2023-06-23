import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  // private login = "http://192.168.1.11:9192/login";
  // private register = 'http://192.168.1.11:8866/register';
  // private medicineAddUrl = 'http://192.168.1.11:8866/addmedicine';
  // private exerciseAddUrl = 'http://192.168.1.11:8866/addExercise';
  // private foodAddUrl = 'http://192.168.1.11:8866/saveFood';
  // private appointmentAddUrl = 'http://192.168.1.11:8866/takeAppointment';
  // public SECRET_KEY = "Shubham12345";

  constructor(private http: HttpClient, private router: Router,private key : KeyService ) { }


 

  registerUser(userData: any) {
    const registerUrl = `${this.key.register}`;
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'}).set('Secret-Key', this.key.SECRET_KEY);
    return this.http.post(registerUrl, userData, { headers });

          
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
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);
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
