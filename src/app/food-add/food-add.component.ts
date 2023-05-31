import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servise/user.service';

@Component({
  selector: 'app-food-add',
  templateUrl: './food-add.component.html',
  styleUrls: ['./food-add.component.css']
})
export class FoodAddComponent {
  food = {
    foodname:'',
    date:'',
    foodtime:''
  }

  
  constructor(private userServise: UserService, private router: Router) { }

  onfood() {  // Update the method name to match the one used in the template
    this.userServise.foodAdd(this.food).subscribe(
      (response: any) => {
        // Registration successful, do something with the response
        console.log('Add successful', response);
        // Redirect to a success page or perform any other action
        this.router.navigate(['/food-history']);

      },
      (error: any) => {
        // Registration failed, handle the error
        console.error('Error occurred during add', error);
        // Display an error message or perform any other action
      }
    );
  }

 
  

}
