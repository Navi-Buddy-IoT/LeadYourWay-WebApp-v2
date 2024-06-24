import { Component, Input } from '@angular/core';
import { Bicycle } from '../../../models/bicycle.model';

@Component({
  selector: 'app-velocity',
  standalone: true,
  imports: [],
  templateUrl: './velocity.component.html',
  styleUrl: './velocity.component.scss',
})
export class VelocityComponent {
  @Input() bicycle!: Bicycle;
}
