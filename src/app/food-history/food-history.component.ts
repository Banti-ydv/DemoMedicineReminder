import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  position: number;
  foodname: string;
  date: string;
  foodtime: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, foodname: 'Hydrogen', date: '11/01/1018', foodtime: '11:10 am'},
  {position: 2, foodname: 'Helium', date: '22/02/2028', foodtime: '02:20 am'},
];


@Component({
  selector: 'app-food-history',
  templateUrl: './food-history.component.html',
  styleUrls: ['./food-history.component.css']
})
export class FoodHistoryComponent {

  displayedColumns: string[] = ['position', 'foodname', 'date', 'foodtime', 'edit', 'delete'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}