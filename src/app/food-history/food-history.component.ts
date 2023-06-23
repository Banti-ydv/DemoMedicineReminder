import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import Swal from 'sweetalert2';
import { KeyService } from '../servise/key.service';

export interface PeriodicElement {
  id: number;
  foodname: string;
  date: string;
  foodtime: string;

}




@Component({
  selector: 'app-food-history',
  templateUrl: './food-history.component.html',
  styleUrls: ['./food-history.component.css']
})
export class FoodHistoryComponent implements OnInit{

  displayedColumns: string[] = ['id', 'foodname', 'date', 'foodtime', 'edit', 'delete'];
  dataSource = new MatTableDataSource<PeriodicElement>();

  constructor(
    private http: HttpClient,
    private confirmService: NgConfirmService,
    private router: Router,
    private key : KeyService
    ) { }
    
  ngOnInit() {
    this.callApi();
  }


  

  callApi() {
    const token = localStorage.getItem('token'); // Replace with your actual token

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<PeriodicElement[]>(this.key.myFood, { headers }).subscribe(
      (data: PeriodicElement[]) => {
        this.dataSource.data = data;
        
      },
      (error) => {
        console.error('An error occurred while calling the API:', error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteFood(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want delete this food ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
        this.http.delete(this.key.deleteMyFood+`${id}`, { headers }).subscribe(
          () => {
            console.log('Food deleted successfully.');
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          },
          (error) => {
            console.error('An error occurred while deleting the food:', error);
          }
        );
      }
    });
  }


  updateFood(element: PeriodicElement): void {
    const formattedDate = this.formatDate(element.date);
    Swal.fire({
      title: 'Update Food',
      html:
        '<label for="swal-input-foodname" class="swal2-label">Name:</label>' +
        '<input id="swal-input-foodname" class="swal2-input" value="' +
        element.foodname +
        '"><br>' +
      '<label for="swal-input-date" class="swal2-label">Date:</label>' +
        '<input type="date" id="swal-input-date" class="swal2-input" value="' +
        formattedDate +
        '"><br>' +
      '<label for="swal-input-foodtime" class="swal2-label">Time:</label>' +
        '<input type="time" id="swal-input-foodtime" class="swal2-input" value="' +
        element.foodtime +
        '"><br>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const nameValue = (<HTMLInputElement>document.getElementById('swal-input-foodname')).value;
        // const shapeValue = (<HTMLInputElement>document.getElementById('swal-input-shape')).value;
        // const doseValue = (<HTMLInputElement>document.getElementById('swal-input-dose')).value;
        const dateValue = (<HTMLInputElement>document.getElementById('swal-input-date')).value;
        const timeValue = (<HTMLInputElement>document.getElementById('swal-input-foodtime')).value;
        // const descriptionValue = (<HTMLInputElement>document.getElementById('swal-input-description')).value;
  
        return {
          foodname: nameValue,
          date: dateValue,
          foodtime: timeValue,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formValues = result.value;
        if (formValues) {
          const { foodname, date, foodtime} = formValues;
  
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
          const updatedData: PeriodicElement = {
            ...element,
            foodname: foodname,
            date: date,
            foodtime: foodtime,
          };
  
          this.http.put(this.key.updateMyFood+`${element.id}`, updatedData, { headers }).subscribe(
            () => {
              console.log('Food updated successfully.');
  
              const updatedElements = this.dataSource.data.map((e) =>
                e.id === element.id ? updatedData : e
              );
              this.dataSource.data = updatedElements;
              Swal.fire('Success!', 'Food updated successfully.', 'success');
            },
            (error) => {
              console.error('An error occurred while updating the Food:', error);
              Swal.fire('Error!', 'An error occurred while updating the Food.', 'error');
            }
          );
        }
      }
    });
  }

  formatDate(date: string | null): string {
    if (date) {
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = ('0' + (parsedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + parsedDate.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    }
    return '';
  }
  
}