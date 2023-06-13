import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private login = "http://192.168.1.11:9192/login";
  private register = 'http://192.168.1.11:8866/register';
  private medicineAddUrl = 'http://192.168.1.11:8866/addmedicine';
  private exerciseAddUrl = 'http://192.168.1.11:8866/addExercise';
  private foodAddUrl = 'http://192.168.1.11:8866/saveFood';
  private appointmentAddUrl = 'http://192.168.1.11:8866/takeAppointment';
  public SECRET_KEY = "Shubham12345";

  constructor(private http: HttpClient, private router: Router) { }


  generateToken(username: string, password: string) {
    const deviceToken = localStorage.getItem('deviceToken');
    const loginUrl = `${this.login}?username=${username}&password=${password}&deviceToken=${deviceToken}`;
    console.log("deviceToken", deviceToken)
    return this.http.get(loginUrl);
  }

  registerUser(userData: any) {
    const registerUrl = `${this.register}`;
    
    const headers = new HttpHeaders({'Content-Type': 'application/json'}).set('Secret-Key', this.SECRET_KEY);
    return this.http.post(registerUrl, userData, { headers });

          
  }


  medicineAdd(medicineAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.SECRET_KEY);

    return this.http.post(this.medicineAddUrl, medicineAdd, { headers });
  }



  exerciseAdd(exerciseAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.SECRET_KEY);
    return this.http.post(this.exerciseAddUrl, exerciseAdd, { headers });
  }

  foodAdd(foodAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.SECRET_KEY);

    return this.http.post(this.foodAddUrl, foodAdd, { headers });
  }

  appointmentAdd(appointmentAdd: any) {
    const token = localStorage.getItem('token');
    console.log(token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.SECRET_KEY);

    return this.http.post(this.appointmentAddUrl, appointmentAdd, { headers });
  }


}
