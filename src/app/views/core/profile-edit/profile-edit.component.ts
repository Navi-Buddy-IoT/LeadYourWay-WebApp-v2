import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SaveUser } from '../../../models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatDatepicker,
    MatFormField,
    MatDatepickerToggle,
    MatLabel,
    MatHint,
    MatCardActions,
    MatDatepickerModule,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent {
  UserData!: SaveUser;
  UserInfoForm!: NgForm;
  dataSource = new MatTableDataSource();

  id: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.UserData = {} as SaveUser;
  }

  ngOnInit() {
    this.id = this.cookieService.get('JUID');
    this.getUserInfoById(this.id);
  }

  updateOffer() {
    this.userService.updateItem(this.UserData).subscribe(
      (response: any) => {
        this.router.navigate(['/profile']);
      },
      (error: any) => {
        this.router.navigate(['/profile']);
      }
    );
  }

  cancelEdit() {
    this.UserInfoForm.resetForm();
  }

  getUserInfoById(id: string | null) {
    this.userService.getItem(id).subscribe((response: any) => {
      this.UserData.id = this.cookieService.get('JUID');
      this.UserData.name = String(response.name);
      this.UserData.email = String(response.email);
      this.UserData.photoUrl = String(response.photoUrl);
    });
  }
}
