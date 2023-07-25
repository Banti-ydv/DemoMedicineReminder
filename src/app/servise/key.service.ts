import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyService {
  public Url = "http://192.168.1.11:8866/";

  public login = `http://192.168.1.11:9192/login`;
  public logout = `${this.Url}signout`;

  public register = `${this.Url}register`;
  public addmedicine = `${this.Url}addmedicine`;
  public addExercise = `${this.Url}addExercise`;
  public saveFood = `${this.Url}saveFood`;
  public takeAppointment = `${this.Url}takeAppointment`;
  public MyDetailes = `${this.Url}MyDetailes`;
  public deleteMydetail = `${this.Url}deleteMydetail`;
  public current_photo = `${this.Url}photo/current`;
  public upload_photo = `${this.Url}upload-photo`;
  public updateMydetailes = `${this.Url}updateMydetailes`;
  public myAppointment = `${this.Url}myAppointment`;
  public deleteMyAppointmnetdetail = `${this.Url}deleteMyAppointmnetdetail/`;
  public updateMyAppointment = `${this.Url}updateMyAppointment/`;
  public getAppointmentById = `${this.Url}getAppointmentById/`;
  public myExercise = `${this.Url}myExercise`;
  public deleteMyExercise = `${this.Url}deleteMyExercise/`;
  public updateMyExercise = `${this.Url}updateMyExercise/`;
  public myFood = `${this.Url}myFood`;
  public deleteMyFood = `${this.Url}deleteMyFood/`;
  public updateMyFood = `${this.Url}updateMyFood/`;
  public mymedicine = `${this.Url}mymedicine`;
  public deleteMyMedicine = `${this.Url}deleteMyMedicine/`;
  public updateMyMedicine = `${this.Url}updateMyMedicine/`;
  public doctorProfile = `${this.Url}addDoctor`;
  public defaultImageUrl = "assets/img/profile-img.png";
  public SECRET_KEY = "Shubham12345";
  

  constructor() { }
}
