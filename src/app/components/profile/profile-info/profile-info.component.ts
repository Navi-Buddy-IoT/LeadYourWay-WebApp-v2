import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent {
  @Input() user!: User;
}
