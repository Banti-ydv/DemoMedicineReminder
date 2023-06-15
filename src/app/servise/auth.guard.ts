import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const allowedComponents = ['home', 'login', 'register']; // Specify the component paths that should be allowed

    if (!token && !allowedComponents.includes(window.location.pathname.slice(1))) {
      this.router.navigate(['/login']); // Redirect to login if token is undefined and the component is not in the allowedComponents array
      return false;
    }

    return true; // Allow access if token is undefined or if the component is in the allowedComponents array
  }
}
