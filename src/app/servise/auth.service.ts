import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import Swal from 'sweetalert2';

import { KeyService } from './key.service';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    private isLoggedIn = false;
  

    constructor(private http: HttpClient, private router: Router, private userService: UserService,private key :KeyService) { }

    logIn(username: string, password: string) {
      
        const deviceToken = localStorage.getItem('deviceToken');
        const loginUrl = `${this.key.login}?username=${username}&password=${password}&deviceToken=${deviceToken}`;
        console.log("deviceToken", deviceToken)
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' }).set('Secret-Key', this.key.SECRET_KEY);
        
        const expirationTime = new Date().getTime() + 5 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString());

        this.isLoggedIn = true;
        return this.http.get(loginUrl, { headers });



        // log in code
    }
    logOut(): void {
        Swal.fire({
          title: 'Logout',
          text: 'Are you sure you want to log out?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, log out'
        }).then((result) => {
          if (result.isConfirmed) {
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.key.SECRET_KEY);
      
            this.http.post(this.key.logout, null, { headers }).subscribe(
              (response) => {
                console.log('Logged out successfully.', response);
      
                localStorage.removeItem('token');
                localStorage.removeItem('responseSize');
                this.isLoggedIn = false;
      
                Swal.fire({
                  title: 'Logged Out',
                  text: 'You have been logged out.',
                  icon: 'success',
                  showConfirmButton: false,
            timer: 2000,
                }).then((result) => {
                  if (result) {
                    location.reload();
                  }
                });
              },
              (error) => {
                console.error('An error occurred while logging out:', error);
              }
            );
          }
        });
      }
      

    getIsLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        return token !== null;

    }

    setMinDate(): string {
        const today: Date = new Date();
        const year: string = today.getFullYear().toString();
        const month: string = (today.getMonth() + 1).toString().padStart(2, '0');
        const day: string = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }



}

