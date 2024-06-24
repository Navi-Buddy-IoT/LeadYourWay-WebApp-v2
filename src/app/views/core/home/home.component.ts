import { Component, inject } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Bicycle } from '../../../models/bicycle.model';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { BicycleService } from '../../../services/bicycle.service';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { CardBicycleComponent } from '../../../components/bicycle/card-bicycle/card-bicycle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    JsonPipe,
    CommonModule,
    MatPaginatorModule,
    HeaderComponent,
    CardBicycleComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  calendar = inject(NgbCalendar);
  bicycleService = inject(BicycleService);
  router = inject(Router);
  userService = inject(UserService);

  model!: NgbDateStruct;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  today: NgbDate | null = null;
  bicycles: Bicycle[] = [];

  constructor() {
    this.today = this.calendar.getToday();
    this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.toDate = this.calendar.getNext(this.fromDate, 'd', 3);
    localStorage.setItem(
      'fromDate',
      `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`
    );
    localStorage.setItem(
      'toDate',
      `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`
    );
  }

  ngOnInit(): void {
    this.getAllBicycles();
  }

  getBicycles(): void {
    if (this.fromDate && this.toDate) {
      this.getBicyclesByDateRange();
    } else {
      this.getAllBicycles();
    }
  }

  getBicyclesByDateRange(): void {
    if (this.fromDate && this.toDate) {
      const fromDate: string = `${this.fromDate.year}-${
        this.fromDate.month < 10
          ? '0' + this.fromDate.month
          : this.fromDate.month
      }-${
        this.fromDate.day < 10 ? '0' + this.fromDate.day : this.fromDate.day
      }`;
      const toDate: string = `${this.toDate.year}-${
        this.toDate.month < 10 ? '0' + this.toDate.month : this.toDate.month
      }-${this.toDate.day < 10 ? '0' + this.toDate.day : this.toDate.day}`;
      this.bicycleService
        .getBicyclesByDateRange(fromDate, toDate)
        .subscribe((bicycles) => {
          this.bicycles = bicycles;
        });
      localStorage.setItem('fromDate', fromDate);
      localStorage.setItem('toDate', toDate);
    }
  }

  getAllBicycles(): void {
    this.bicycleService.getList().subscribe((bicycles) => {
      this.bicycles = bicycles;
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.getBicyclesByDateRange();
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  search() {
    this.getBicycles();
  }
}
