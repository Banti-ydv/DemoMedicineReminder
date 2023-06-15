import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedIn = false;
    private login = "http://192.168.1.11:9192/login";
    private logoutUrl = 'http://192.168.1.11:8866/signout';
    // private userDetailsUrl = 'http://192.168.1.11:8866/MyDetailes';

    constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

    logIn(username: string, password: string) {
        const deviceToken = localStorage.getItem('deviceToken');
        const loginUrl = `${this.login}?username=${username}&password=${password}&deviceToken=${deviceToken}`;
        console.log("deviceToken", deviceToken)
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' }).set('Secret-Key', this.userService.SECRET_KEY);

        this.isLoggedIn = true;
        return this.http.get(loginUrl, { headers });



        // log in code
    }

    logOut() {
        // log out code
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Secret-Key', this.userService.SECRET_KEY);
        this.http.post(this.logoutUrl, null, { headers }).subscribe(
            (response) => {
                console.log('Logged out successfully.', response);

                localStorage.removeItem('token');
                this.router.navigate(['/login']);
                this.isLoggedIn = false;
                location.reload();
                // Perform any additional actions after successful logout
            },
            (error) => {

                console.error('An error occurred while logging out:', error);
            }
        );
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

