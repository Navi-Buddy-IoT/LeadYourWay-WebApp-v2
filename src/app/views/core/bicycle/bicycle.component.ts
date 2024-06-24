import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { Bicycle } from '../../../models/bicycle.model';
import { BicycleService } from '../../../services/bicycle.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { GoogleMapComponent } from '../../../components/bicycle/google-map/google-map.component';
import { TemperatureComponent } from '../../../components/bicycle/temperature/temperature.component';
import { VelocityComponent } from '../../../components/bicycle/velocity/velocity.component';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-bicycle',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    GoogleMapComponent,
    TemperatureComponent,
    VelocityComponent,
  ],
  templateUrl: './bicycle.component.html',
  styleUrl: './bicycle.component.scss',
})
export class BicycleComponent implements OnInit, OnDestroy {
  bicycleId: number | undefined;
  bicycle: Bicycle | undefined;

  userId = '';

  toDate: string | null;
  fromDate: string | null;
  totalDays: number | undefined;
  totalCost = 0;

  private dataSubscription: Subscription | undefined;
  private countdownSubscription: Subscription | undefined;
  private pollingInterval = 5000;
  private countdownInterval = 1000;
  countdown = this.pollingInterval / 1000;

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
    this.dataSubscription = interval(this.pollingInterval).subscribe(() => {
      this.fetchData();
      this.resetCountdown();
    });
    this.startCountdown();
  }

  fetchData(): void {
    if (!this.bicycle) {
      return;
    }
    this.bicycleService.getItem(this.bicycle.id).subscribe((bicycle) => {
      this.bicycle = bicycle;
    });
  }

  startCountdown(): void {
    this.countdownSubscription = interval(this.countdownInterval).subscribe(
      () => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.resetCountdown();
        }
      }
    );
  }

  resetCountdown(): void {
    this.countdown = this.pollingInterval / 1000;
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

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
