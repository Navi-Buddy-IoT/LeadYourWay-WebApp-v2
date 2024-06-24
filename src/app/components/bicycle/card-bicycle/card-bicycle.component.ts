import { Component, Input, inject } from '@angular/core';
import { Bicycle } from '../../../models/bicycle.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-bicycle',
  standalone: true,
  imports: [],
  templateUrl: './card-bicycle.component.html',
  styleUrl: './card-bicycle.component.scss',
})
export class CardBicycleComponent {
  @Input() bicycle!: Bicycle;
  router = inject(Router);

  onReserve(id: number) {
    localStorage.setItem('bicycleId', String(this.bicycle.id));
    this.router.navigate(['/bicycles']);
  }
}
