import { Component, Input, inject } from '@angular/core';
import { Bicycle } from '../../../models/bicycle.model';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bicycle-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bicycle-list.component.html',
  styleUrl: './bicycle-list.component.scss',
})
export class BicycleListComponent {
  @Input() user!: User;
  @Input() title!: String;
  @Input() bicycles!: Bicycle[];

  router = inject(Router);

  ngOnInit(): void {}
}
