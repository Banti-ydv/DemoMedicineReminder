import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import Swal from 'sweetalert2';

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
    private router: Router
    ) { }
    
  ngOnInit() {
    this.callApi();
  }


  

  callApi() {
    const apiUrl = 'http://192.168.1.11:8866/myFood';
    const token = localStorage.getItem('token'); // Replace with your actual token

    // Set the headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<PeriodicElement[]>(apiUrl, { headers }).subscribe(
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
        const apiUrl = `http://192.168.1.11:8866/deleteMyFood/${id}`;
        const token = localStorage.getItem('token'); 
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
        this.http.delete(apiUrl, { headers }).subscribe(
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
    Swal.fire({
      title: 'Update Food',
      html:
        '<input id="swal-input-foodname" class="swal2-input" value="' +
        element.foodname +
        '">' +
        '<input id="swal-input-date" class="swal2-input" value="' +
        element.date +
        '">' +
        '<input id="swal-input-foodtime" class="swal2-input" value="' +
        element.foodtime +
        '">',
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
  
          const apiUrl = `http://192.168.1.11:8866/updateMyFood/${element.id}`;
          const token = localStorage.getItem('token');
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
          const updatedData: PeriodicElement = {
            ...element,
            foodname: foodname,
            date: date,
            foodtime: foodtime,
          };
  
          this.http.put(apiUrl, updatedData, { headers }).subscribe(
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
}