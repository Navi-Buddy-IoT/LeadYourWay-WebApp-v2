import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { Bicycle } from '../../../models/bicycle.model';
import { BicycleService } from '../../../services/bicycle.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-bicycle',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './bicycle.component.html',
  styleUrl: './bicycle.component.scss',
})
export class BicycleComponent {
  bicycleId: number | undefined;
  bicycle: Bicycle | undefined;

  userId = '';

  toDate: string | null;
  fromDate: string | null;
  totalDays: number | undefined;
  totalCost = 0;

  constructor(
    private bicycleService: BicycleService,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService
  ) {
    this.bicycleId = Number(localStorage.getItem('bicycleId'));
    this.toDate = localStorage.getItem('toDate');
    this.fromDate = localStorage.getItem('fromDate');
    this.getNumberOfDays();
  }

  ngOnInit(): void {
    this.userId = this.cookieService.get('JUID') || '';
    this.getBicycle();
  }

  getBicycle(): void {
    if (this.bicycleId) {
      this.bicycleService.getItem(this.bicycleId).subscribe(
        (bicycle) => {
          this.bicycle = bicycle;
          this.getTotalCost();
        },
        (error) => {
          alert(
            'Para reservar debes tener una cuenta\nSera redirigido a la pagina de registro'
          );
          this.router.navigate(['/signup']);
        }
      );
    }
  }
  getStarGradient(rating: number): string {
    const percentage = (rating / 5) * 100;
    return `linear-gradient(to right, #ffcc00 0%, #ffcc00 ${percentage}%, #cccccc ${percentage}%, #cccccc 100%)`;
  }

  getStarPercentage(rating: number): number {
    return (rating / 5) * 100;
  }

  getNumberOfDays() {
    if (this.toDate && this.fromDate) {
      const date1 = new Date(this.toDate);
      const date2 = new Date(this.fromDate);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  getTotalCost() {
    if (this.totalDays && this.bicycle) {
      this.totalCost = this.totalDays * this.bicycle.bicyclePrice;
    } else {
      this.totalCost = 0;
    }
    return this.totalCost;
  }

  onReserve() {
    this.userService.getItem(this.userId).subscribe((response: any) => {
      var userInfo = response.cards.length;
      if (userInfo > 0) {
        this.router.navigate(['/reservation']);
      } else {
        alert(
          'To reserve a bicycle you need to add a payment method\nYou will be redirected to the payment method page'
        );
        this.router.navigate(['/profile']);
      }
    });
  }
}
