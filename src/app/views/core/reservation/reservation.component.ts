import { Component, Inject } from '@angular/core';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forEach, toNumber } from 'lodash';
import { BicycleService } from '../../../services/bicycle.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Bicycle } from '../../../models/bicycle.model';
import { Card } from '../../../models/card.model';
import { Rent } from '../../../models/rent.model';
import { RentService } from '../../../services/rent.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { DialogBoxComponent } from '../../../components/shared/dialog-box/dialog-box.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  user!: User;
  bicycle!: Bicycle;
  cardArray: Card[] = [];
  rent!: Rent;
  userId = '';
  bikeId = '';
  selectedCardId = 0;
  precioSubTotal = 0;
  precioSeguro = 0;
  totalCost = 0;
  checkedSeguro1 = false;
  checkedSeguro2 = false;
  checkedSeguro3 = false;
  identificationNumber = 0;
  toDate: string | null;
  fromDate: string | null;
  totalDays: number | undefined;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private bicycleService: BicycleService,
    private rentService: RentService,
    private cookieService: CookieService,
    private datePipe: DatePipe
  ) {
    this.toDate = this.formatDate(localStorage.getItem('toDate'));
    this.fromDate = this.formatDate(localStorage.getItem('fromDate'));
    this.getNumberOfDays();
  }

  ngOnInit(): void {
    this.userId = this.cookieService.get('JUID') || '';
    this.bikeId = localStorage.getItem('bicycleId') || '';
    this.getUser();
    this.getBike();
  }

  formatDate(date: string | null): string | null {
    return date ? this.datePipe.transform(date, 'yyyy-MM-dd') : null;
  }

  getUser() {
    this.userService.getItem(this.userId).subscribe((response: any) => {
      this.user = response;
      var oneCard = false;
      forEach(this.user.cards, (card) => {
        if (card.cardMain) {
          this.cardArray.push(card);
        } else if (!oneCard) {
          this.cardArray.push(card);
          oneCard = true;
        }
      });
    });
  }

  getBike() {
    this.bicycleService
      .getItem(Number(this.bikeId))
      .subscribe((response: any) => {
        this.bicycle = response;
        this.getTotalCost();
      });
  }

  openDialog() {
    this.rent = {
      rentStartDate: this.fromDate || '',
      rentEndDate: this.toDate || '',
      rentPrice: this.totalCost || 0,
      bicycleId: Number(this.bikeId),
      cardId: this.selectedCardId,
    };

    this.rentService.createItem(this.rent).subscribe((response: any) => {
      const dialogRef: MatDialogRef<any> = this.dialog.open(
        DialogBoxComponent,
        {
          data: {
            title: 'Yeah!',
            message:
              'Your reservation has been successfully created. You can check it in your profile',
          },
        }
      );
      dialogRef.afterClosed().subscribe(() => {
        localStorage.removeItem('bicycleId');
        this.router.navigate(['/home']);
      });
    });
  }

  formatCardNumber(cardNumber: string) {
    return cardNumber.substring(12, 16);
  }

  formatCardExpiry(expiryDate: string) {
    return `${expiryDate.slice(5, 7)}/${expiryDate.slice(2, 4)}`;
    // const date = String(expiryDate);
    // const [year, month] = date.split('-');
    // return `${month}/${year.slice(2, 4)}`;
  }

  updateCheckedCard(id: number) {
    switch (id) {
      case 1:
        this.checkedSeguro1 = !this.checkedSeguro1;
        break;
      case 2:
        this.checkedSeguro2 = !this.checkedSeguro2;
        break;
      case 3:
        this.checkedSeguro3 = !this.checkedSeguro3;
        break;
    }
    this.updatePrecioSeguro();
  }

  updatePrecioSeguro() {
    var price = 0;
    if (this.checkedSeguro1) {
      price += 19;
    }
    if (this.checkedSeguro2) {
      price += 29;
    }
    if (this.checkedSeguro3) {
      price += 39;
    }
    this.precioSeguro = price;
    this.totalCost = this.precioSubTotal + this.precioSeguro;
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
    }
    this.precioSubTotal = this.totalCost || 0;
  }

  cardSelectChange(id: number) {
    console.log(id);
    this.selectedCardId = id;
  }

  validateCard() {
    if (this.selectedCardId <= 0) {
      alert('Select a card to continue');
      return;
    }
    if (this.identificationNumber.toString().length < 7) {
      alert('Identification number must be 7 digits');
      return;
    }
    this.openDialog();
  }

  updateIdentificationNumber(target: any) {
    if (target.value.length > 7) {
      this.identificationNumber = target.value;
    }
  }
}
