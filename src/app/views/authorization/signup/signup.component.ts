import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Auth2Service } from '../../../services/auth-v2.service';
import { HttpClient } from '@angular/common/http';
import { SaveUser } from '../../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  fb = inject(FormBuilder);
  htpp = inject(HttpClient);
  router = inject(Router);
  authService = inject(Auth2Service);
  userService = inject(UserService);
  cookieService = inject(CookieService);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    this.clearCookies();
    if (!this.validateForm()) {
      alert('Form is invalid');
      return;
    }
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email, rawForm.password).subscribe(
      (response) => {
        this.cookieService.set('JUID', response.user.uid, 1, '/');
        this.cookieService.set('JSESSIONID', response.user.accessToken, 1, '/');
        const user: SaveUser = {
          id: response.user.uid,
          name: rawForm.name,
          email: rawForm.email,
          photoUrl: 'https://robohash.org/' + rawForm.name,
        };
        this.userService
          .registerUser(user, response.user.accessToken)
          .subscribe(
            () => {
              this.router.navigate(['/home']);
            },
            (error) => {}
          );
      },
      (error) => {
        alert('Looks like you already have an account. Please login instead.');
        this.router.navigate(['/login']);
      }
    );
  }

  validateForm(): boolean {
    const rawForm = this.form.getRawValue();
    if (
      rawForm.password !== rawForm.confirmPassword ||
      rawForm.name === '' ||
      rawForm.email === '' ||
      rawForm.password === '' ||
      rawForm.password.length < 6
    ) {
      return false;
    }
    return true;
  }

  clearCookies() {
    this.cookieService.delete('JUID');
    this.cookieService.delete('JSESSIONID');
  }
}
