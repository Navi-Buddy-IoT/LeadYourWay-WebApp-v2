import { Component, Input, inject } from '@angular/core';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss',
})
export class PaymentMethodsComponent {
  router = inject(Router);
  @Input() user!: User;
  onSubmit() {
    this.router.navigate(['/payment-method']);
  }
}
