import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Bicycle } from '../../../models/bicycle.model';
import { BicycleService } from '../../../services/bicycle.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss',
})
export class TemperatureComponent {
  @Input() bicycle!: Bicycle;
}
