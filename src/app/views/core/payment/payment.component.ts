import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { Router } from '@angular/router';
import { CardSave } from '../../../models/card.model';
import { CardService } from '../../../services/card.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../../components/shared/dialog-box/dialog-box.component';
import { CookieService } from 'ngx-cookie-service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, HeaderComponent, MatRadioModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  dialog = inject(MatDialog);
  cookieService = inject(CookieService);
  PaymentForm!: NgForm;
  PaymentData!: CardSave;

  year: string;
  month: string;

  userId: string;

  constructor(
    private paymentMethodService: CardService,
    private router: Router
  ) {
    this.PaymentData = {} as CardSave;
    this.year = '';
    this.month = '';
    this.userId = this.cookieService.get('JUID');
  }

  onSubmit(PaymentForm: NgForm) {
    if (PaymentForm.invalid) {
      this.openSnackBar('Invalid data');
      return;
    }

    if (!this.isValidCardNumber(this.PaymentData.cardNumber)) {
      this.openSnackBar('Invalid card number, must be 16 digits');
      return;
    }

    if (!this.isValidCVV(this.PaymentData.cardCvv)) {
      this.openSnackBar('Invalid CVV, must be 3 or 4 digits');
      return;
    }

    if (!this.isValidExpirationMonth(this.month)) {
      this.openSnackBar('Invalid month');
      return;
    }

    if (!this.isValidExpirationYear(this.year)) {
      this.openSnackBar('Invalid year');
      return;
    }

    this.addPayment();
  }

  openSnackBar(message: string) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Oops!',
        message: message,
      },
    });
  }

  confirmation(message: string) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Yay!',
        message: message,
      },
    });
  }

  isValidEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  isValidCardNumber(cardNumber: string) {
    const cardNumberPattern = /^\d{16}$/;
    return cardNumberPattern.test(cardNumber);
  }

  isValidCVV(cvv: string) {
    const cvvPattern = /^\d{3,4}$/;
    return cvvPattern.test(cvv);
  }

  isValidExpirationMonth(month: string) {
    const monthPattern = /^(0?[1-9]|1[0-2])$/;
    return monthPattern.test(month);
  }

  isValidExpirationYear(year: string) {
    const yearPattern = /^\d{4}$/;
    return yearPattern.test(year);
  }

  addPayment() {
    this.PaymentData.cardMain = false;
    this.PaymentData.cardAmount = 10000;
    this.updateCardExpirationDate();
    this.PaymentData.cardType = this.PaymentData.cardType;
    this.paymentMethodService
      .createItem(this.userId, this.PaymentData)
      .subscribe(
        (response) => {
          this.confirmation('Your card has been added successfully');
          this.router.navigate(['/profile']);
        },
        (error) => {
          this.openSnackBar('Error adding payment method');
        }
      );
  }

  updateCardExpirationDate() {
    this.PaymentData.cardExpirationDate = `${this.year}-${this.month}-06`;
  }
}
