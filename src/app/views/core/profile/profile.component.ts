import { Component, inject } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { BicycleListComponent } from '../../../components/profile/bicycle-list/bicycle-list.component';
import { EditInfoComponent } from '../../../components/profile/edit-info/edit-info.component';
import { ProfileInfoComponent } from '../../../components/profile/profile-info/profile-info.component';
import { PaymentMethodsComponent } from '../../../components/profile/payment-methods/payment-methods.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Bicycle } from '../../../models/bicycle.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    BicycleListComponent,
    EditInfoComponent,
    ProfileInfoComponent,
    PaymentMethodsComponent,
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  cookieService = inject(CookieService);
  router = inject(Router);
  calendar = inject(NgbCalendar);

  user!: User;
  rentedBicycles: Bicycle[] = [];
  userId: string | null = null;
  UserData!: User;
  selectedDate!: Date;
  dataSource = new MatTableDataSource();

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor() {
    this.UserData = {} as User;

    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  }

  getUser() {
    const userId = this.cookieService.get('JUID');
    this.userService.getItem(userId).subscribe((response: any) => {
      this.user = response;
    });
    // todo get rented bicycles
  }

  ngOnInit(): void {
    this.userId = this.cookieService.get('JSESSIONID');
    if (this.userId != null) {
      this.getUser();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
}
